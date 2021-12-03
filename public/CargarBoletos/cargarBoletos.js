

class CargarBoletos extends HTMLElement{
  
    #urlGateway = "http://localhost:3001/ServicioPagos/";
    #urlBoletos = this.#urlGateway + "boletosApartados";

    constructor() {
        super();
    }
    
    connectedCallback() {
        const idSorteo = this.getAttribute("idSorteo");
        const shadow = this.attachShadow({ mode: "open" });
        this.#render(shadow);
        this.#agregarEstilos(shadow);
        this.#cargarBoletosApartados(shadow, idSorteo);
    }

    #agregarEstilos(shadow){
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./CargarBoletos/css/material-dashboard.css?v=3.0.0");
        shadow.appendChild(link);
    }

    #render(shadow){
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
            <a class="btn bg-gradient-primary mt-4" href="" type="button">Guardar cambios</a>
          </div>
        </div>
  
        <div class="sidenav-footer position-absolute ">
          <div class="mx-3">
            <a class="btn bg-gradient-primary mt-4" href="" type="button">Revertir cambios</a>
          </div>
        </div>
        
      </div>
        `;
    }

    #cargarBoletosApartados(shadow, idSorteo){
      let cuerpoTabla = shadow.querySelector("#cuerpo-tabla");

      console.log(cuerpoTabla)

      fetch(this.#urlBoletos + "?idSorteo=" + idSorteo).then((response) => {
          return response.json();
      }).then((boletos) => {
              boletos.forEach(boleto => {
                  console.log(boleto)
                  cuerpoTabla.innerHTML += `
                  <tr>
                      <td>
                          <div class="d-flex px-2 py-1">
                          
                              <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">Número `+boleto.numero+`</h6>
                              <p class="text-xs text-secondary mb-0">`+boleto.persona.nombre+`</p>
                              </div>
                          </div>
                      </td>
                      <td>
                          <p class="text-xs font-weight-bold mb-0">`+boleto.comprobantePago+`</p>
                          <p class="text-xs text-secondary mb-0">Cargado</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                          <span class="badge badge-sm bg-gradient-success">`+boleto.estadoBoleto+`</span>
                      </td>
                      <td class="align-middle text-center">
                          <span class="text-secondary text-xs font-weight-bold">`+boleto.movimientoBoleto.fecha+`</span>
                      </td>
                      <td class="align-middle text-center">
                          <label class="switch ">
                              <input type="checkbox">
                              <span class="slider round"></span>
                          </label>
                      </td>
                  </tr>
              `; 
  
              });
          });
          
    }
}

window.customElements.define('boletos-pagados', CargarBoletos)