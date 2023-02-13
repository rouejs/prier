/**
 * Text转换成ArrayBuffer
 *
 * @param {string} str
 * @return {*}  {ArrayBuffer}
 */
const readTextAsArrayBuffer = async (str: string): Promise<ArrayBuffer> => {
  if (!("TextEncoder" in window)) {
    throw Error("TextEncoder is not available");
  }
  const encoder = new TextEncoder();
  return encoder.encode(str);
};
/**
 * ArrayBuffer转Text
 *
 * @param {ArrayBuffer} arrayBuffer
 * @return {*}  {Promise<string>}
 */
const readArrayBuffAsText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  if (!("TextDecoder" in window)) {
    throw Error("TextDecoder is not available");
  }
  const encoder = new TextDecoder();
  return encoder.decode(arrayBuffer);
};
/**
 * Text转Blob
 *
 * @param {string} text
 * @return {*}  {Promise<Blob>}
 */
const readTextAsBlob = async (text: string): Promise<Blob> => {
  return new Blob([text], { type: "plain/text" });
};
/**
 * Blob转Text
 *
 * @param {Blob} blob
 * @return {*}  {Promise<string>}
 */
const readBlobAsText = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(blob);
  });
};
/**
 * Blob转ArrayBuffer
 *
 * @param {Blob} blob
 * @return {*}  {Promise<ArrayBuffer>}
 */
const readBlobAsArrayBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsArrayBuffer(blob);
  });
};
/**
 * ArrayBuffer转Blob
 *
 * @param {ArrayBuffer} arrayBuffer
 * @return {*}  {Promise<Blob>}
 */
const readArrayBufferAsBlob = async (arrayBuffer: ArrayBuffer): Promise<Blob> => {
  return new Blob([new Uint8Array(arrayBuffer).buffer]);
};
