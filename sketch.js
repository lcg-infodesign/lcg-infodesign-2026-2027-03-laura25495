
let data;
let numeroGlifi = 0;

// Dimensioni della griglia
let margin = 30;
let headerHeight = 205;

let dimColonna = 160;
let dimRiga = 70;

// Scale fisse, per proporzionare i glifi ai dati
let scalaLunghezza = 50;
let scalaSpessore = 10;

// Colori
let coloreSfondo = "#080808";
let coloreGlifi = "#FFFFFF";

let colorScale = {
  "Africa": "#000000",
  "Asia": "#F4C430",
  "Europe": "#31A354",
  "North America": "#E53935",
  "South America": "#E53935",
  "Oceania": "#2878E3"
};

//funzione per caricare il dataset 
async function setup() {

  data = await loadTable("assets/rivers_world - Data.csv", ",", "header");

  numeroGlifi = data.getRowCount();

  // numero colonne e righe 
  let numeroColonne = ceil(sqrt(numeroGlifi));
  let numeroRighe = ceil(numeroGlifi / numeroColonne);

  // dimensioni del canvas
  let larghezzaCanvas = numeroColonne * dimColonna + 2 * margin;
  let altezzaCanvas = numeroRighe * dimRiga + headerHeight + margin;

  createCanvas(larghezzaCanvas, altezzaCanvas);
}

function draw() {

  background(coloreSfondo);
  noStroke();

  // intestazione con titolo, sottotitolo, legenda e scale di rappresentazione 

  textAlign(LEFT, TOP);

  fill(255);
  textStyle(BOLD);
  textSize(28);
  text("Rivers of the World", margin, 22);

  textStyle(NORMAL);
  textSize(12);
  fill(220);

  text("Ogni glifo rappresenta un fiume.", margin, 65 );

  text("Lunghezza glifo = lunghezza del fiume in km",margin, 85 );

  text( "Spessore glifo = portata media del fiume in m³/s", margin, 105 );

  let legenda = [
    ["Africa", "#000000"],
    ["Asia", "#F4C430"],
    ["Europa", "#31A354"],
    ["America", "#E53935"],
    ["Oceania", "#2878E3"]
  ];

  let legendaX = margin;
  let legendaY = 145;

  textSize(11);

  for (let i = 0; i < legenda.length; i++) {

    let nome = legenda[i][0];
    let colore = legenda[i][1];

    fill(colore);

    if (nome === "Africa") {
      stroke(255);
      strokeWeight(1);
    } else {
      noStroke();
    }

    circle(legendaX + 5, legendaY + 5, 10);

    noStroke();
    fill(230);

    text(nome, legendaX + 16, legendaY);

    legendaX += textWidth(nome) + 44;
  }
  
  //scala
  fill(150);
  textSize(10);

  text( "Lunghezza: 1 px = 50 km  |  Spessore: √(portata in m³/s) ÷ 10 = px", margin, 170);

  // linea divisoria
  stroke(65);
  strokeWeight(1);
  line(margin, 195, width - margin, 195);
  noStroke();


  // griglia per disporre i glifi dei fiumi
  let numeroColonne = ceil(sqrt(numeroGlifi));

  let xCorrente = margin;
  let yCorrente = headerHeight;

  // indice del fiume su cui si trova il mouse (-1 vuol dire che il mouse non si trova sorpa nessun fiume)
  let glifoAttivo = -1;

  // ciclo per disegnare tutti i fiumi
  for (let i = 0; i < numeroGlifi; i++) {

    // posizione nella griglia
   let x = xCorrente + dimColonna / 2;
   let y = yCorrente + dimRiga / 2;

    // dati del fiume

    let length = data.getNum(i, "length");
    let discharge = data.getNum(i, "discharge");

   let continent = data.getString(i, "continent");

    // dimensione glifo

    // Lunghezza: 1 px = 50 km
    let larghezza = max(0, length / scalaLunghezza);

    // Spessore: radice quadrata della portata / 10
    let altezza = sqrt(max(0, discharge)) / scalaSpessore; //la radice quadrata permette di ridurre le differenze visive,
    //senza che un glifo sia enorme rispetto a quelli con portata minore, mantenendo comunque più spessi i fiumi con una portata maggiore.//


    // controllo se il mouse si trova sopra il glifo

    // area minima per selezionare anche i glifi sottili
    let areaMouse = max(altezza, 12); //la funzione max rinoscosce il valore più grande tra quelli presenti

    if (
      mouseX > x - larghezza / 2 &&
      mouseX < x + larghezza / 2 &&
      mouseY > y - areaMouse / 2 &&
      mouseY < y + areaMouse / 2
    ) {

      // il mouse si trova sopra questo fiume
      glifoAttivo = i;

      // colore in base al continente
      fill(colorScale[continent] || "#FFFFFF");

      // contorno bianco per l'Africa visto che lo spondo è nero e il colore del continente anche
      if (continent === "Africa") {
        stroke(255);
        strokeWeight(1);
      } else {
        noStroke();
      }

    } else {

      // glifo bianco quando il mouse non è sopra
      fill(coloreGlifi);
      noStroke();
    }

    // glifo del fiume (rettangolo stondato)

    rect(
      x - larghezza / 2,
      y - altezza / 2,
      larghezza,
      altezza,
      min(larghezza, altezza) / 2
    );

    noStroke();

    // passo alla colonna successiva
    xCorrente = xCorrente + dimColonna;

    // al completamento della riga, passo alla successiva
    if (xCorrente >= margin + numeroColonne * dimColonna) {
    xCorrente = margin; 
    yCorrente = yCorrente + dimRiga;
}
  }
  
  //info hover mouse

  if (glifoAttivo !== -1) {

    // dati del fiume indicato dal puntatore del mouse
    let nome = data.getString(glifoAttivo, "name");
    let length = data.getNum(glifoAttivo, "length");
    let discharge = data.getNum(glifoAttivo, "discharge");

    let continent = data .getString(glifoAttivo, "continent")

    // informazioni da mostrare
    let informazioni = nome + " | " + length + " km | " + discharge + " m³/s";

    // grandezza tendina e posizione tendina

    textSize(12);
    textStyle(NORMAL);

    let larghezzaTendina =textWidth(informazioni) + 30;

    let altezzaTendina = 30;

    let posX = mouseX + 15;
    let posY = mouseY - 15;

    // Se esce dal bordo destro si sposta a sinistra
    if (
      posX + larghezzaTendina >
      min(width, windowWidth)
    ) {
      posX = mouseX - larghezzaTendina - 15;
    }

    //colore tendina in base al continente

    fill(colorScale[continent] || "#FFFFFF");

    if (continent === "Africa") {
      stroke(255);
      strokeWeight(1);
    } else {
      noStroke();
    }

    //forma tendina (rettangolo stondato)

    rect(posX, posY,larghezzaTendina, altezzaTendina,15);
    noStroke();

    //colore testo tendina

    if (
      continent === "Africa" ||
      continent === "North America" ||
      continent === "South America"
    ) {
      fill(255);
    } else {
      fill(0);
    }

    //testo tendina

    textAlign(LEFT, CENTER);
    textSize(12);

    text(informazioni, posX + 15, posY + altezzaTendina / 2);
  }
}
