import { app } from "../../scripts/app.js"
import { ComfyWidgets } from "../../scripts/widgets.js"
import { markdownWidgetStyle, mainContainerCssText } from "./styles.js"

const NODE_NAME = "MarkdownRenderer"
const LOG_VERBOSE = false
const log = (...args) => {
  if (LOG_VERBOSE) {
    console.log(`[${NODE_NAME}]`, ...args)
  }
}

app.registerExtension({
  name: "Comfy.MarkdownRenderer",
  async nodeCreated(node) {
    try {
      if (node && node.comfyClass === "MarkdownRenderer") {
        // Add emoji to node title
        node.title = "📝 " + (node.title || "Markdown Renderer")

        // Initialize editing state
        node._hasInputConnection = false
        node._editableContent = ""
        node._hasReceivedData = false
        node._storedHtml = null
        node._sourceText = null

        // Check for existing input connections (for loaded workflows)
        if (node.inputs && node.inputs[0] && node.inputs[0].link) {
          node._hasInputConnection = true
          log("Found existing input connection on workflow load")
        }

        // Monitor for input connections
        const originalOnConnectionsChange = node.onConnectionsChange
        node.onConnectionsChange = function (type, index, connected, link_info) {
          if (originalOnConnectionsChange) {
            originalOnConnectionsChange.call(this, type, index, connected, link_info)
          }

          // Check if input is connected
          if (type === 1 && index === 0) { // type 1 = input, index 0 = first input
            this._hasInputConnection = connected
            log("Input connection changed:", connected)

            if (!connected) {
              // Input disconnected - show editor with current content
              this._hasReceivedData = false
              showEditor.call(this)
            } else {
              // Input connected - reset data received state and show waiting overlay
              this._hasReceivedData = false
              log("Input connected - will show backend rendered content")
              showWaitingForInput.call(this)
            }
          }
        }

        // Initialize with appropriate UI based on connection status
        log("Initializing node, hasInputConnection:", node._hasInputConnection)

        // Use requestAnimationFrame for more deterministic timing
        const initializeUI = () => {
          // Re-check connection status right before initialization (for loaded workflows)
          const hasConnection = node.inputs && node.inputs[0] && node.inputs[0].link
          if (hasConnection) {
            node._hasInputConnection = true
            log("Connection detected during initialization")
          } else {
            node._hasInputConnection = false
          }

          if (!node._hasInputConnection) {
            log("showEditor executing")
            showEditor.call(node)
          } else {
            // Check if we have stored rendered content to restore
            const hasStoredContent = node._storedHtml || (node.properties && node.properties.storedHtml)
            if (hasStoredContent) {
              log("Restoring previously rendered content")
              restoreRenderedContent.call(node)
            } else {
              log("Input connection detected, showing waiting overlay")
              showWaitingForInput.call(node)
            }
          }
        }

        // Use requestAnimationFrame for better timing control
        requestAnimationFrame(initializeUI)
      }
    } catch (error) {
      console.error("[MarkdownRenderer] Error in nodeCreated:", error)
    }
  },

  async beforeRegisterNodeDef(nodeType, nodeData, app) {
    if (nodeData.name === "MarkdownRenderer") {
      // Add custom CSS for markdown styling
      const style = document.createElement('style')
      style.textContent = markdownWidgetStyle

      document.head.appendChild(style)

      // Shared markdown widget creator (moved to global scope)
      window.createMarkdownWidget = function (node, config) {
        const {
          widgetName = 'markdown_widget',
          isEditable = false,
          initialContent = '',
          htmlContent = '',
          sourceText = '',
          onContentChange = null
        } = config

        // Create main container
        const mainContainer = document.createElement('div')
        mainContainer.style.cssText = mainContainerCssText

        // Prevent all clicks on the main container from propagating to the node frame
        mainContainer.addEventListener('click', (e) => {
          e.stopPropagation()
        })

        // Create toolbar
        const toolbar = document.createElement('div')
        toolbar.className = 'markdown-editor-toolbar'

        const charCount = document.createElement('div')
        charCount.className = 'markdown-char-count'

        const toggleGroup = document.createElement('div')
        toggleGroup.className = 'markdown-toggle-group'

        const markdownButton = document.createElement('button')
        markdownButton.className = 'markdown-editor-button active'
        markdownButton.textContent = 'MD'

        const textButton = document.createElement('button')
        textButton.className = 'markdown-editor-button'
        textButton.textContent = 'Text'

        // Create content containers
        const container = document.createElement('div')
        container.className = 'markdown-content'
        container.style.flex = '1'
        container.innerHTML = htmlContent || parseMarkdownSimple(initialContent)

        const textarea = document.createElement('textarea')
        textarea.className = 'markdown-editor-textarea'
        textarea.style.display = 'none'
        textarea.style.flex = '1'
        textarea.readOnly = !isEditable
        textarea.placeholder = isEditable ? 'Enter your markdown content here...' : 'Source markdown from connected input...'
        textarea.value = sourceText || initialContent

        let isSourceMode = false
        let currentContent = initialContent

        // Update character count
        const updateCharCount = () => {
          const text = currentContent || ''
          charCount.textContent = `${text.length} chars`
        }
        updateCharCount()

        // Mode switching functions
        function showMarkdown() {
          container.style.display = 'block'
          textarea.style.display = 'none'
          markdownButton.classList.add('active')
          textButton.classList.remove('active')
          isSourceMode = false
          if (isEditable) {
            container.innerHTML = parseMarkdownSimple(currentContent)
          }
          updateCharCount()
        }

        function showText() {
          textarea.style.display = 'block'
          container.style.display = 'none'
          textButton.classList.add('active')
          markdownButton.classList.remove('active')
          isSourceMode = true
          updateCharCount()
          // Focus the textarea so user can immediately start typing
          setTimeout(() => textarea.focus(), 0)
        }

        // Event handlers - always toggle to the other mode
        markdownButton.addEventListener('click', (e) => {
          e.stopPropagation()
          if (isSourceMode) {
            showMarkdown()
          } else {
            showText()
          }
        })

        textButton.addEventListener('click', (e) => {
          e.stopPropagation()
          if (isSourceMode) {
            showMarkdown()
          } else {
            showText()
          }
        })

        // Create warning indicator for non-editable content
        const warningIndicator = document.createElement('div')
        warningIndicator.className = 'markdown-warning-indicator'
        warningIndicator.style.color = '#6c757d'
        warningIndicator.style.fontSize = '12px'
        warningIndicator.style.fontWeight = 'bold'
        warningIndicator.style.display = isEditable ? 'none' : 'block'
        warningIndicator.textContent = '🔒 Read-only'
        warningIndicator.title = 'Editing is disabled while input is connected. Disconnect the input to enable manual editing.'

        // Click-to-edit functionality for editable widgets
        if (isEditable) {
          container.addEventListener('click', (e) => {
            // Prevent triggering if click originated from toolbar
            if (toolbar.contains(e.target)) {
              return
            }
            // Stop propagation to prevent outer node frame clicks
            e.stopPropagation()
            // Only trigger when in markdown mode (not when already in text mode)
            if (!isSourceMode) {
              showText()
            }
          })
          container.style.cursor = 'text'

          // Prevent textarea clicks from bubbling up and triggering mode switches
          textarea.addEventListener('click', (e) => {
            e.stopPropagation()
          })
        } else {
          // For non-editable content (input connected), add tooltip to both container and textarea
          const tooltipText = 'Editing is disabled while input is connected. Disconnect the input to enable manual editing.'
          container.title = tooltipText
          textarea.title = tooltipText
        }

        if (isEditable) {
          textarea.addEventListener('input', () => {
            currentContent = textarea.value
            updateCharCount()
            if (onContentChange) onContentChange(currentContent)
          })

          // Auto-save functionality
          const autoSaveAndPreview = () => {
            if (isSourceMode) {
              if (textarea.value !== currentContent) {
                currentContent = textarea.value
                if (onContentChange) onContentChange(currentContent)
              }
              showMarkdown()
            }
          }

          const originalOnDeselected = node.onDeselected
          node.onDeselected = function () {
            autoSaveAndPreview()
            if (originalOnDeselected) originalOnDeselected.call(this)
          }

          const handleDocumentClick = (e) => {
            if (!mainContainer.contains(e.target)) {
              autoSaveAndPreview()
            }
          }
          document.addEventListener('click', handleDocumentClick)
        }

        // Assemble UI
        toggleGroup.appendChild(markdownButton)
        toggleGroup.appendChild(textButton)
        toolbar.appendChild(charCount)
        toolbar.appendChild(warningIndicator)
        toolbar.appendChild(toggleGroup)
        mainContainer.appendChild(toolbar)
        mainContainer.appendChild(container)
        mainContainer.appendChild(textarea)

        // Create widget config
        const widgetConfig = {
          getValue: () => currentContent,
          setValue: (value) => {
            currentContent = value || ''
            if (textarea) textarea.value = currentContent
            if (container && !htmlContent) {
              container.innerHTML = parseMarkdownSimple(currentContent)
            }
            updateCharCount()
          },
          getHeight: () => 350,
          hideOnZoom: false
        }

        // For editable widgets, also create a hidden text widget to store content for backend
        if (isEditable) {
          widgetConfig.callback = () => {
            // Ensure the hidden widget gets the current content
            const hiddenWidget = node.widgets?.find(w => w.name === 'text')
            if (hiddenWidget) {
              hiddenWidget.value = currentContent
            }
          }
        }

        if (isEditable) {
          widgetConfig.onRemove = () => {
            document.removeEventListener('click', handleDocumentClick)
          }
        }

        return node.addDOMWidget(widgetName, 'STRING', mainContainer, widgetConfig)
      }

      // Make parseMarkdownSimple available globally for the widget creator
      window.parseMarkdownSimple = parseMarkdownSimple

      // Make populate function available globally for restoreRenderedContent
      window.populateMarkdownWidget = function populate(html) {
        if (this.widgets) {
          // Remove widgets without clearing the array completely to preserve input socket
          const widgetsToRemove = [...this.widgets]
          for (let widget of widgetsToRemove) {
            widget.onRemove?.()
            const index = this.widgets.indexOf(widget)
            if (index > -1) {
              this.widgets.splice(index, 1)
            }
          }
        }

        const v = [...html]
        if (!v[0]) v.shift()

        for (let list of v) {
          if (!(list instanceof Array)) list = [list]
          for (const l of list) {
            // Get source text for character count
            let sourceText = 'Source content not available from connected input.'
            if (this._sourceText && this._sourceText.length > 0) {
              const sourceIndex = this.widgets?.length || 0
              sourceText = this._sourceText[sourceIndex] || this._sourceText[0] || sourceText
            } else if (this.inputs && this.inputs[0] && this.inputs[0].link) {
              const link = app.graph.links[this.inputs[0].link]
              if (link) {
                const sourceNode = app.graph.getNodeById(link.origin_id)
                if (sourceNode && sourceNode.widgets) {
                  const sourceWidget = sourceNode.widgets.find(w => w.name === 'text' || w.value)
                  if (sourceWidget && sourceWidget.value) {
                    sourceText = sourceWidget.value
                  }
                }
              }
            }

            window.createMarkdownWidget(this, {
              widgetName: 'text_' + (this.widgets?.length ?? 0),
              isEditable: false,
              htmlContent: l,
              sourceText: sourceText,
              initialContent: sourceText
            })
          }
        }

        // Update node size with reasonable bounds
        requestAnimationFrame(() => {
          const sz = this.computeSize()
          if (sz[0] < this.size[0]) sz[0] = this.size[0]
          if (sz[1] < this.size[1]) sz[1] = this.size[1]

          // Prevent runaway height increases
          if (sz[1] > 800) sz[1] = 800
          if (sz[0] > 600) sz[0] = 600

          this.onResize?.(sz)
          app.graph.setDirtyCanvas(true, false)
        })
      }

      // When the node is executed we will be sent the input text, display this in the widget
      const onExecuted = nodeType.prototype.onExecuted
      nodeType.prototype.onExecuted = function (message) {
        onExecuted?.apply(this, arguments)
        log("Node executed with message:", message)

        // Only process execution results if we have an input connection and HTML content
        if (this._hasInputConnection && message.html) {
          // Store the original text for source viewing and mark as received
          this._sourceText = message.text || []
          this._storedHtml = message.html
          this._hasReceivedData = true

          // Save to properties for persistence across reloads
          if (!this.properties) this.properties = {}
          this.properties.storedHtml = message.html
          this.properties.sourceText = message.text || []

          window.populateMarkdownWidget.call(this, message.html)
        }
      }

      const VALUES = Symbol()
      const configure = nodeType.prototype.configure
      nodeType.prototype.configure = function () {
        // Store unmodified widget values as they get removed on configure by new frontend
        this[VALUES] = arguments[0]?.widgets_values
        return configure?.apply(this, arguments)
      }

      const onConfigure = nodeType.prototype.onConfigure
      nodeType.prototype.onConfigure = function () {
        onConfigure?.apply(this, arguments)
        const widgets_values = this[VALUES]

        // Restore stored content from properties if available
        if (this.properties) {
          if (this.properties.storedHtml) {
            this._storedHtml = this.properties.storedHtml
            this._sourceText = this.properties.sourceText || []
            this._hasReceivedData = true
            log("Restored stored content in onConfigure")
          }
        }

        if (widgets_values?.length) {
          // Check if we have an input connection before populating
          const hasConnection = this.inputs && this.inputs[0] && this.inputs[0].link
          if (hasConnection) {
            // In newer frontend there seems to be a delay in creating the initial widget
            requestAnimationFrame(() => {
              window.populateMarkdownWidget.call(this, widgets_values)
            })
          }
          // If no connection, showEditor will be called by the nodeCreated timeout
        }
      }
    }
  }
})

function showEditor(node) {
  log("showEditor called, this:", this)

  // Remove any existing widgets, but preserve input structure
  if (this.widgets) {
    log("Removing existing widgets:", this.widgets.length)
    // Remove widgets without clearing the array completely to preserve input socket
    const widgetsToRemove = [...this.widgets]
    for (let widget of widgetsToRemove) {
      widget.onRemove?.()
      const index = this.widgets.indexOf(widget)
      if (index > -1) {
        this.widgets.splice(index, 1)
      }
    }
  }

  // Set default content if none exists, but first check for existing saved content
  if (!this._editableContent) {
    // Try to restore content from multiple sources
    let existingContent = ''

    // 1. Check if we have a text widget with existing content
    const existingTextWidget = this.widgets?.find(w => w.name === 'text' && w.value)
    if (existingTextWidget && existingTextWidget.value.trim()) {
      existingContent = existingTextWidget.value
      log("Restored content from existing text widget:", existingContent.substring(0, 50) + "...")
    }

    // 2. Check if there's stored content in node properties (for workflow reload)
    if (!existingContent && this.properties && this.properties.text && this.properties.text.trim()) {
      existingContent = this.properties.text
      log("Restored content from node properties:", existingContent.substring(0, 50) + "...")
    }

    // 3. Check stored _editableContent from previous sessions
    if (!existingContent && this._editableContent && this._editableContent.trim() &&
      !this._editableContent.includes('Write your **markdown** content here!')) {
      existingContent = this._editableContent
      log("Using existing _editableContent:", existingContent.substring(0, 50) + "...")
    }

    // Use existing content or fall back to placeholder
    this._editableContent = existingContent || `Write your **markdown** content here!
- Bullet points
- *Italic text*
- \`Code snippets\`
`
  }

  // Create a hidden text widget to store content for the backend (only when no input connection)
  let textWidget = null
  if (!this._hasInputConnection) {
    textWidget = ComfyWidgets.STRING(this, 'text', ['STRING', { multiline: true }], app).widget
    textWidget.value = this._editableContent || ""
    textWidget.type = 'hidden'
  }

  const widget = window.createMarkdownWidget(this, {
    widgetName: 'markdown_editor',
    isEditable: true,
    initialContent: this._editableContent,
    onContentChange: (content) => {
      log("onContentChange called with content:", { editableContent: this._editableContent, content })
      this._editableContent = content

      // Update the hidden widget value so it gets sent to backend (only if we have one)
      if (textWidget) {
        textWidget.value = content
      }

      // Save to node properties for persistence across reloads
      if (!this.properties) this.properties = {}
      this.properties.text = content
    }
  })

  log("Editor widget created:", widget)

  // Set minimum node size
  if (this.size[0] < 400) this.size[0] = 400
  if (this.size[1] < 350) this.size[1] = 350
}

function restoreRenderedContent() {
  log("restoreRenderedContent called")

  // Restore from stored properties if available
  if (this.properties && this.properties.storedHtml) {
    this._storedHtml = this.properties.storedHtml
    this._sourceText = this.properties.sourceText || []
    this._hasReceivedData = true
    log("Restored HTML and source from properties")
  }

  // Populate with the stored content
  if (this._storedHtml) {
    window.populateMarkdownWidget.call(this, this._storedHtml)
  } else {
    // Fallback to waiting overlay if no content found
    showWaitingForInput.call(this)
  }
}

function showWaitingForInput() {
  log("showWaitingForInput called")

  // Remove any existing widgets, but preserve connection state and input structure
  if (this.widgets) {
    log("Removing existing widgets:", this.widgets.length)
    // Remove widgets without clearing the array completely to preserve input socket
    const widgetsToRemove = [...this.widgets]
    for (let widget of widgetsToRemove) {
      widget.onRemove?.()
      const index = this.widgets.indexOf(widget)
      if (index > -1) {
        this.widgets.splice(index, 1)
      }
    }
  }

  // Create waiting overlay container
  const mainContainer = document.createElement('div')
  mainContainer.style.cssText = mainContainerCssText

  // Create the waiting overlay
  const overlay = document.createElement('div')
  overlay.className = 'markdown-waiting-overlay'

  const icon = document.createElement('div')
  icon.className = 'markdown-waiting-icon'
  icon.textContent = '⏳'

  const title = document.createElement('div')
  title.className = 'markdown-waiting-title'
  title.textContent = 'Waiting for Input'

  const subtitle = document.createElement('div')
  subtitle.className = 'markdown-waiting-subtitle'
  subtitle.textContent = 'This node is connected to an input source. Execute the workflow to see the rendered markdown content.'

  const note = document.createElement('div')
  note.className = 'markdown-waiting-note'
  note.textContent = 'Manual content will be overridden'

  overlay.appendChild(icon)
  overlay.appendChild(title)
  overlay.appendChild(subtitle)
  overlay.appendChild(note)
  mainContainer.appendChild(overlay)

  // Create widget config
  const widgetConfig = {
    getValue: () => '',
    setValue: () => { },
    getHeight: () => 350,
    hideOnZoom: false
  }

  const widget = this.addDOMWidget('waiting_overlay', 'STRING', mainContainer, widgetConfig)

  log("Waiting overlay widget created:", widget)

  // Set minimum node size
  if (this.size[0] < 400) this.size[0] = 400
  if (this.size[1] < 350) this.size[1] = 350
}

function hideEditor() {
  // Remove editor widgets
  if (this.widgets) {
    for (let i = 0; i < this.widgets.length; i++) {
      if (this.widgets[i].name === 'markdown_editor') {
        this.widgets[i].onRemove?.()
        this.widgets.splice(i, 1)
        break
      }
    }
  }
}

// Simple markdown parser for local preview (before backend processing)
function parseMarkdownSimple(text) {
  if (!text) return ''

  // Escape HTML first
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Headers
  text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold and italic
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Code blocks (fenced)
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')

  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Blockquotes
  text = text.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

  // Lists
  text = text.replace(/^[\*\-] (.*$)/gim, '<li>$1</li>')
  text = text.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')

  // Wrap consecutive list items
  text = text.replace(/(<li>.*<\/li>)/gs, (match) => {
    return '<ul>' + match + '</ul>'
  })

  // Simple table support (basic)
  text = text.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map(cell => cell.trim())
    return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>'
  })
  text = text.replace(/(<tr>.*<\/tr>)/gs, '<table border="1">$1</table>')

  // Line breaks and paragraphs
  text = text.replace(/\n\n/g, '</p><p>')
  text = text.replace(/\n/g, '<br>')
  text = '<p>' + text + '</p>'

  // Clean up empty paragraphs
  text = text.replace(/<p><\/p>/g, '')
  text = text.replace(/<p>(<h[1-6]>)/g, '$1')
  text = text.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
  text = text.replace(/<p>(<blockquote>)/g, '$1')
  text = text.replace(/(<\/blockquote>)<\/p>/g, '$1')
  text = text.replace(/<p>(<pre>)/g, '$1')
  text = text.replace(/(<\/pre>)<\/p>/g, '$1')
  text = text.replace(/<p>(<ul>)/g, '$1')
  text = text.replace(/(<\/ul>)<\/p>/g, '$1')
  text = text.replace(/<p>(<table>)/g, '$1')
  text = text.replace(/(<\/table>)<\/p>/g, '$1')

  return text
}  