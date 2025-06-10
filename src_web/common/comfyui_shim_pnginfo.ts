
/**
 * [🤮] See `./comfyui_shim.ts`.
 *
 * This code has been forked from https://github.com/Comfy-Org/ComfyUI_frontend/blob/0937c1f2cd5026f390a6efa64f630e01ea414d1d/src/scripts/pnginfo.ts
 * with some modifications made, such as removing unneeded exported functions, cleaning up trivial
 * typing, etc.
 */


/**
 * [🤮] A type to add to untypd portions of the code below where they were not yet typed in Comfy's
 * code.
 */
type lazyComfyAny = any;


function getFromPngBuffer(buffer: ArrayBuffer) {
  // Get the PNG data as a Uint8Array
  const pngData = new Uint8Array(buffer)
  const dataView = new DataView(pngData.buffer)

  // Check that the PNG signature is present
  if (dataView.getUint32(0) !== 0x89504e47) {
    console.error('Not a valid PNG file')
    return
  }

  // Start searching for chunks after the PNG signature
  let offset = 8
  let txt_chunks: Record<string, string> = {}
  // Loop through the chunks in the PNG file
  while (offset < pngData.length) {
    // Get the length of the chunk
    const length = dataView.getUint32(offset)
    // Get the chunk type
    const type = String.fromCharCode(...pngData.slice(offset + 4, offset + 8))
    if (type === 'tEXt' || type == 'comf' || type === 'iTXt') {
      // Get the keyword
      let keyword_end = offset + 8
      while (pngData[keyword_end] !== 0) {
        keyword_end++
      }
      const keyword = String.fromCharCode(
        ...pngData.slice(offset + 8, keyword_end)
      )
      // Get the text
      const contentArraySegment = pngData.slice(
        keyword_end + 1,
        offset + 8 + length
      )
      const contentJson = new TextDecoder('utf-8').decode(contentArraySegment)
      txt_chunks[keyword] = contentJson
    }

    offset += 12 + length
  }
  return txt_chunks
}

function getFromPngFile(file: File) {
  return new Promise<Record<string, string>>((r) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      r(getFromPngBuffer((event.target as lazyComfyAny).result as ArrayBuffer) as lazyComfyAny)
    }

    reader.readAsArrayBuffer(file)
  })
}

function parseExifData(exifData: lazyComfyAny) {
  // Check for the correct TIFF header (0x4949 for little-endian or 0x4D4D for big-endian)
  const isLittleEndian = String.fromCharCode(...exifData.slice(0, 2)) === 'II'

  // Function to read 16-bit and 32-bit integers from binary data
  function readInt(offset: lazyComfyAny, isLittleEndian: lazyComfyAny, length: lazyComfyAny) {
    let arr = exifData.slice(offset, offset + length)
    if (length === 2) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getUint16(
        0,
        isLittleEndian
      )
    } else if (length === 4) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getUint32(
        0,
        isLittleEndian
      )
    }
    // lazyComfyAny
    throw new Error('Shouldn\'t get here.');
  }

  // Read the offset to the first IFD (Image File Directory)
  const ifdOffset = readInt(4, isLittleEndian, 4)

  function parseIFD(offset: lazyComfyAny) {
    const numEntries = readInt(offset, isLittleEndian, 2) as lazyComfyAny;
    const result = {} as lazyComfyAny

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = offset + 2 + i * 12
      const tag = readInt(entryOffset, isLittleEndian, 2) as lazyComfyAny
      const type = readInt(entryOffset + 2, isLittleEndian, 2)
      const numValues = readInt(entryOffset + 4, isLittleEndian, 4)
      const valueOffset = readInt(entryOffset + 8, isLittleEndian, 4) as lazyComfyAny;

      // Read the value(s) based on the data type
      let value
      if (type === 2) {
        // ASCII string
        value = new TextDecoder('utf-8').decode(
          exifData.subarray(valueOffset, valueOffset + numValues - 1)
        )
      }

      result[tag] = value
    }

    return result
  }

  // Parse the first IFD
  const ifdData = parseIFD(ifdOffset)
  return ifdData
}

function splitValues(input: lazyComfyAny) {
  var output = {} as lazyComfyAny
  for (var key in input) {
    var value = input[key]
    var splitValues = value.split(':', 2)
    output[splitValues[0]] = splitValues[1]
  }
  return output
}

export function getPngMetadata(file: File): Promise<Record<string, string>> {
  return getFromPngFile(file)
}

export function getWebpMetadata(file: lazyComfyAny) {
  return new Promise<Record<string, string>>((r) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const webp = new Uint8Array((event.target as lazyComfyAny).result as ArrayBuffer)
      const dataView = new DataView(webp.buffer)

      // Check that the WEBP signature is present
      if (
        dataView.getUint32(0) !== 0x52494646 ||
        dataView.getUint32(8) !== 0x57454250
      ) {
        console.error('Not a valid WEBP file')
        r({})
        return
      }

      // Start searching for chunks after the WEBP signature
      let offset = 12
      let txt_chunks = {} as lazyComfyAny
      // Loop through the chunks in the WEBP file
      while (offset < webp.length) {
        const chunk_length = dataView.getUint32(offset + 4, true)
        const chunk_type = String.fromCharCode(
          ...webp.slice(offset, offset + 4)
        )
        if (chunk_type === 'EXIF') {
          if (
            String.fromCharCode(...webp.slice(offset + 8, offset + 8 + 6)) ==
            'Exif\0\0'
          ) {
            offset += 6
          }
          let data = parseExifData(
            webp.slice(offset + 8, offset + 8 + chunk_length)
          )
          for (var key in data) {
            const value = data[key] as string
            if (typeof value === 'string') {
              const index = value.indexOf(':')
              txt_chunks[value.slice(0, index)] = value.slice(index + 1)
            }
          }
          break
        }

        offset += 8 + chunk_length
      }

      r(txt_chunks)
    }

    reader.readAsArrayBuffer(file)
  })
}

export function getLatentMetadata(file: lazyComfyAny) {
  return new Promise((r) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const safetensorsData = new Uint8Array((event.target as lazyComfyAny).result as ArrayBuffer)
      const dataView = new DataView(safetensorsData.buffer)
      let header_size = dataView.getUint32(0, true)
      let offset = 8
      let header = JSON.parse(
        new TextDecoder().decode(
          safetensorsData.slice(offset, offset + header_size)
        )
      )
      r(header.__metadata__)
    }

    var slice = file.slice(0, 1024 * 1024 * 4)
    reader.readAsArrayBuffer(slice)
  })
}