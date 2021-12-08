class CargarBoletos extends HTMLElement {
  #urlGateway = "http://localhost:3001/servicioPagos/";
  #urlGatewayNumPagos = "http://localhost:3006/servicioNumPagos/";
  #urlBoletos = this.#urlGateway + "boletosApartados";
  #urlComprobantes = this.#urlGatewayNumPagos+"comprobantes/";

  constructor() {
    super();
  }

  connectedCallback() {
    const idSorteo = this.getAttribute("idSorteo");
    const shadow = this.attachShadow({ mode: "open" });
    this.#agregarScripts(shadow);
    this.#render(shadow);
    this.#agregarEstilos(shadow);
    this.#cargarBoletosApartados(shadow, idSorteo);
    this.#guardarCambios(shadow, idSorteo);
    this.#revertirCambios(shadow);
    this.#preparaBotonesComprobante(shadow);
  }

  #agregarEstilos(shadow) {
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "./CargarBoletos/css/material-dashboard.css?v=3.0.0");
    shadow.appendChild(link);
  }

  #agregarScripts(shadow) {
    let script= document.createElement("script");
    script.setAttribute("src", "https://cdn.jsdelivr.net/npm/sweetalert2@9");
    shadow.appendChild(script);

    script = document.createElement("script");
    script.setAttribute("src", "./CargarBoletos/js/funcionesComprobante.js");
    shadow.appendChild(script);
  }

  #render(shadow) {
    shadow.innerHTML += `
        <div class="container-fluid py-4">
        <div class="row">
          <div class="col-12">
            <div class="card my-4">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                  <h6 class="text-white text-capitalize ps-3">Numeros apartados</h6>
                </div>
              </div>
              <div class="card-body px-0 pb-2">
                <div class="table-responsive p-0">
                  <table class="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Numero</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Comprobante</th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estatus</th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Fecha pagado</th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Marcar pagado</th>
                      </tr>
                    </thead>
                    <tbody id="cuerpo-tabla">
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sidenav-footer">
          <div class="mx-3">
            <a id="btnGuardar" class="btn bg-gradient-primary mt-4" href="" type="button">Guardar cambios</a>
            <a id="btnCancelar" class="btn bg-gradient-primary mt-4" href="" type="button">Revertir cambios</a>
          </div>
        </div>
        
      </div>
        `;
  }



  #cargarBoletosApartados(shadow, idSorteo) {
    let cuerpoTabla = shadow.querySelector("#cuerpo-tabla");
    fetch(this.#urlBoletos + "?idSorteo=" + idSorteo).then((response) => {
      return response.json();
    }).then((boletos) => {
      boletos.forEach(boleto => {
        cuerpoTabla.innerHTML += `
                  <tr>
                      <td>
                          <div class="d-flex px-2 py-1">
                          
                              <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">Número `+ boleto.numero + `</h6>
                              <p class="text-xs text-secondary mb-0">`+ boleto.persona.nombre + `</p>
                              </div>
                          </div>
                      </td>
                      <td>
                          <input type="button" value="Ver Comprobante" onclick="verComprobante(${boleto.numero}, '${boleto.comprobantePago}', '${this.#urlComprobantes}')"></input>
                      </td>
                      <td class="align-middle text-center text-sm">
                          <span class="badge badge-sm bg-gradient-success">`+ boleto.estadoBoleto + `</span>
                      </td>
                      <td class="align-middle text-center">
                          <span class="text-secondary text-xs font-weight-bold">`+ new Date(boleto.movimientoBoleto.fecha).toLocaleString() + `</span>
                      </td>
                      <td class="align-middle text-center">
                          <label class="switch ">
                              <input id="${boleto._id}" type="checkbox">
                              <span class="slider round"></span>
                          </label>
                      </td>
                  </tr>
              `;

      });
    });

  }

  #getBoletosSeleccionados(shadow) {
    let pagando = new Array();
    shadow.querySelectorAll("input[type=checkbox]:checked").forEach(element => {
      let boleto = new Object();
      boleto.id = element.id;
      pagando.push(boleto);
    });
    return pagando;
  }

  #revertirCambios(shadow){

    let btnCancelar = shadow.querySelector("#btnCancelar");
    btnCancelar.onclick = (evt) => {
      evt.preventDefault();
      shadow.querySelectorAll("input[type=checkbox]:checked").forEach(element => {
        element.checked=false;
      });
    }
  }

  #guardarCambios(shadow, idSorteo) {
    let btnGuardar = shadow.querySelector("#btnGuardar");

    btnGuardar.onclick = (evt) => {
      evt.preventDefault();
      /*fetch(this.#urlBoletos + "?idSorteo=" + idSorteo).then((response) => {
        return response.json();
    }).then((boletos) => {
    });*/
      let boletos = this.#getBoletosSeleccionados(shadow);

      if (boletos.length > 0) {
        console.log(JSON.stringify(boletos))
        const formData = new FormData();
        formData.append('boletos', JSON.stringify(boletos));

        fetch(this.#urlBoletos, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(boletos)
        })
          .then(res => {
            window.location = "./index.html";
          })
          .catch(err => {
            console.log(err.message);

          });

        return;
      } else {
        alert('Primero debe seleccionar al menos 1 boleto.');
      }
    }


  }

  #preparaBotonesComprobante(shadow){
    let botones = shadow.querySelector(".btnVerComprobante");

  /*  botones.forEach(boton=>{
      boton.onclick=(evt)=>{
        evt.preventDefault();
        Swal.fire('hola');
      }
    });*/
  }

}

window.customElements.define('boletos-pagados', CargarBoletos);