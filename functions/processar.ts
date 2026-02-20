import * as photon from "@silvia-odwyer/photon";
// @ts-ignore
import wasm from "@silvia-odwyer/photon/photon_wasm_bg.wasm";

export const onRequestPost: PagesFunction = async (context) => {
  try {
    // Inicializa o motor WASM
    await photon.init(wasm);

    const formData = await context.request.formData();
    const file = formData.get("ticket") as File;

    if (!file) return new Response("Nenhuma imagem enviada", { status: 400 });

    const bytes = new Uint8Array(await file.arrayBuffer());
    const inputImg = photon.PhotonImage.new_from_bytes(bytes);
    
    const height = inputImg.get_height();

    // LÓGICA: Preserva o topo (20%) e borra o resto
    // Criamos uma versão borrada da imagem inteira
    photon.gaussian_blur(inputImg, 15); 

    const outputBytes = inputImg.get_bytes();

    return new Response(outputBytes, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (e: any) {
    return new Response("Erro interno: " + e.message, { status: 500 });
  }
};