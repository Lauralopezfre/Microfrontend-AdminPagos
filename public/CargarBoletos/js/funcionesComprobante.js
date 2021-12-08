function verComprobante(numero, archivo, url) {
  if (archivo.split('.')[1] == "pdf") {
    window.open(url+archivo);
  } else {
    Swal.fire({
      title: `Numero: ${numero}`,
      imageUrl: url + archivo
    });
  }
}