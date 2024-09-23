const carouselInner = document.getElementById('carousel-inner');

async function fetchHighStocks() {
    const response = await fetch('highStocks.json');
    const data = await response.json();
    return data.stocks.slice(0, 6); 
}

function createCarouselItem(stock) {
    return `
        <div class="carousel-item">
            <h4>${stock.ticker} <small>${stock.companyName}</small></h4>
            <p>Variação: ${stock.variation}</p>
        </div>
    `;
}

async function initCarousel() {
    const stocks = await fetchHighStocks();
    const allStocks = [...stocks, ...stocks]; // Duplicar a lista para o efeito infinito

    allStocks.forEach(stock => {
        const itemHTML = createCarouselItem(stock);
        carouselInner.innerHTML += itemHTML;
    });

    // Ajuste a largura total do carrossel
    const totalItems = allStocks.length;
    const carouselWidth = totalItems * 300; // 300 é a largura de cada item
    carouselInner.style.width = `${carouselWidth}px`;
}

// Inicializa o carrossel
initCarousel();
