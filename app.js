let cidis = [];
const cartContainer = document.getElementById("cartContainer");
const URLJSON = "data/cds.json";

$(document).ready(function(){

  $("#btnContainer").hide();
  $("#filterContainer").hide(); 
  $("#btnActivator").click(function() {
    if ( $("#btnContainer").first().is(":hidden") ) {
      $("#btnActivator").hide();
      $("#filterContainer").show("slow");
      $("#btnContainer").show("slow");
    } else {
      $("#filterContainer").slideUp();
      $("#btnContainer").slideUp();
    }
  });

  $('#btnArtist').on('click', function () {
    cidis.sort(function(a, b) {
      var artistaA = a.artista.toUpperCase();
      var artistaB = b.artista.toUpperCase();
      if (artistaA < artistaB) {
        return -1;
      }
      if (artistaA > artistaB) {
        return 1;
      }
      return 0;
    });  
    addCdsToTable(cidis); 
  });

  $('#btnAlbum').on('click', function () {
    cidis.sort(function(a, b) {
      var albumA = a.album.toUpperCase();
      var albumB = b.album.toUpperCase();
      if (albumA < albumB) {
        return -1;
      }
      if (albumA > albumB) {
        return 1;
      }
      return 0;
    });
    addCdsToTable(cidis);
  });

  $('#btnAGenere').on('click', function () {
    cidis.sort(function(a, b) {
      var generoA = a.genero.toUpperCase();
      var generoB = b.genero.toUpperCase();
      if (generoA < generoB) {
        return -1;
      }
      if (generoA > generoB) {
        return 1;
      }
      return 0;
    });
    addCdsToTable(cidis);
  });

  $('#btnAPrice').on('click', function () {
    cidis.sort( (a, b) => a.precio - b.precio );
    addCdsToTable(cidis);
  });

  $('#btnCleaner').on('click', function () {
    clearCart(); 
  });

  $('#textToFilter').on('keyup', function () {
    let textToFilter = document.getElementById("textToFilter").value.toUpperCase();
    let filterCidis = cidis.filter(cd => {
    if (
        cd.album.toUpperCase().includes(textToFilter)   ||
        cd.artista.toUpperCase().includes(textToFilter) ||
        cd.genero.toUpperCase().includes(textToFilter)  ||
        cd.precio.toString().toUpperCase().includes(textToFilter)
        )
        return true;
      return false;
    });
    addCdsToTable(filterCidis);
  });

});

function addCdsToTable(cds) {
  itemContainer.innerHTML = null;
  for (const cd of cds) {
    $('#itemContainer').append(`
        <div class="card m-5 text-center" style="min-width: 12rem;">
          <img class="card-img-top img-fluid align-self-center" src="${cd.urlImagen}" alt="${cd.descImagen}">
          <div class="card-body">
            <h3 class="card-title">${cd.artista}</h4>
            <h5 class="card-title">${cd.album}</h5>
            <p class="cardGenere">${cd.genero}</p>
            <p class="cardPrice">$ ${cd.precio}</p>
            <button id="btnAddCart${cd.id}"class="btn btn-light btn-sm">Agregar</button>
          </div>
        </div>`);
    $(`#btnAddCart${cd.id}`).on('click', function () {
      let selectedCd = cidis.find(c => c.id === cd.id);
      selectedCd.cantidad += 1;
      addSelectedCd(selectedCd);
      cartContainer.style.display = "inline";
    });
  }
}

function addCartToTable() {
  tableBodyCart.innerHTML = null;
  for (const cd of cartArray) {
    $('#tableBodyCart').append(`
      <tr>
        <td>${cd.artista}</td>
        <td>${cd.album}</td>
        <td>${cd.genero}</td>
        <td>$${cd.precio}</td>
        <td>${cd.cantidad}</td>
        <td><button id="btnDeleteCart${cd.id}"class="btn btn-light btn-sm">Eliminar</button></td>
      </tr>`);
    $(`#btnDeleteCart${cd.id}`).on('click', function () {
      let selectedCd = cartArray.find(c => c.id === cd.id);
      selectedCd.cantidad -= 1;
      cartArray = cartArray.filter(x => x.cantidad !== 0);
      if (cartArray.length === 0) {
        clearCart();
      }
      else {
        addSelectedCd(selectedCd);
      }
    });
  }
};

function addSelectedCd(selectedCd) {
  let findInCart = cartArray.find(c => c.id === selectedCd.id );
  if (findInCart === undefined && selectedCd.cantidad !== 0) {
    cartArray.push(selectedCd);
  } 
  localStorage.setItem('cartArray', JSON.stringify(cartArray));
  addCartToTable();
}

function clearCart(){
  tableBodyCart.innerHTML = null;
  localStorage.clear();
  cartArray = [];
  cartContainer.style.display = "none";
  cidis.map(x => x.cantidad = 0);
}

if (localStorage.getItem('cartArray')) {
  cartContainer.style.display = "break";
  cartArray = JSON.parse(localStorage.getItem('cartArray'));
  cartArray.forEach(x => addCartToTable(x));
} else {
  clearCart();
}

$.getJSON(URLJSON, function (respuesta, estado) {
  if (estado === "success") {
    cidis = respuesta;
    addCdsToTable(cidis);
  }
});