# Progetto finale InfoVis

## La realizzazione
La visualizzazione relativa a questo progetto è stata realizzata a partire dai dati ottenuti alla fine del secondo progetto di Big Data. I dati visualizzati riguardano lo studio dell'impatto dei college americani sul gioco professionistico della NBA, in particolare:
 - si sono individuate sette categorie di giocatori, definite sotto
 - per ogni giocatore si sono analizzati i primi quattro anni di carriera (se presenti, altrimenti quelli disponibili)
 - ad ogni giocatore è stato associato un punteggio per ogni categoria
 - il punteggio di un college, per una categoria, è la sommatoria dei punteggi dei giocatori provenienti da quel college per la particolare categoria analizzata
 - il punteggio di uno stato, per una categoria, è la sommatoria dei punteggi dei college situati in quello stato per la particolare categoria analizzata

Il risultato finale è un ranking dei college e degli stati sulla base dei punteggi dei singoli giocatori, suddiviso in categorie, è comunque presente un ranking globale che tiene conto dei punteggi ottenuti in tutte le categorie.

## I dati

I dati sono stati estratti da [BasketBall-Reference](http://www.basketball-reference.com/), sono stati selezionati tutti i dati delle regular seasons dai primi anni '50 fino alla stagione 2016-2017. Il dataset comprende più di 4500 giocatori e più di 17M di partite per un totale di circa 390M statistiche atomiche.

Le categorie di giocatori individuate sono:
- "plus/minus", giocatori apportano un contributo alla squadra anche senza che questo sia evidente nelle statistiche
- "all-around", giocatori capaci di essere efficaci in vari aspetti del gioco
- "tiratori da 2 punti", tiratori eccellenti soprattuto da dentro l'arco dei 3 punti
- "tiratori da 3 punti", tiratori eccellenti soprattuto fuori l'arco dei 3 punti
- "difensori", giocatori capaci di difendere il canestro in maniera eccellente
- "attaccanti", giocatori capaci di segnare svariate volte con alta efficienza
- "rimbalzisti", giocatori capaci di catturare sia rimbalzi difensivi che offensivi

I numeri legati agli score possono sembrare incongruenti, infatti la somma dei punteggi dei giocatori di un college non risulta essere uguale al punteggio del college stesso, questo perché gli scores sono stati calcolati solamente all'interno di una particolare categoria. I risultati sono stati poi normalizzati tra 0 e 100 per omogeneizzare tutti gli scores, rendendoli di fatto sommabili inter-categoria in maniera congruente. Dunque gli scores presenti nella visualizzazione sono congruenti solamente all'interno della categoria analizzata e solamente all'interno della particolare granularità (stati/colleges/giocatori). A valle di questi aggiustamenti, il ranking rimane congruente, questo perché le operazioni effettuate sono servite solo a scalare i risultati in maniera da renderli sommabili, di fatto dando ad ogni categoria lo stesso peso delle altre.

## Le tecnologie

Per sviluppare la visualizzazione sono state utilizzate delle API online supportate da MongoDB, a causa di questo la visualizzazione può essere utilizzata solamente se si è connessi ad internet. Si è scelto di utilizzare delle API online per sgravare il fruitore della visualizzazione dal setup di server web e database, complicato a causa della natura Big Data dei dati.

Per fruire al meglio della visualizzazione si consiglia di utilizzarla a schermo intero e con l'utilizzo di un browser come [Chrome](https://www.google.it/chrome/browser/desktop/index.html), [Chromium](https://www.chromium.org/Home) o Safari; browser come Firefox risultano avere dei problemi di visualizzazione.

Le tecnologie utilizzate sono le seguenti:

- [D3.js v4](https://d3js.org/) per la visualizzazione dei dati
- [Bootstrap 3](http://getbootstrap.com/) per la gestione del layout responsive
- [JQuery](https://jquery.com/) per la gestione del DOM (laddove l'utilizzo di D3.js non fosse stato ottimale)

## Utilizzo

La visualizzazione può essere lanciata anche in locale *(file:///...)* senza l'utilizzo di un server web, tutte le librerie necessarie vengono importate attraverso le CDN a supporto della specifica libreria richiesta.

La visualizzazione potrebbe non essere subito disponibile, questo a causa del server web remoto che ha la necessità di qualche secondo di avvio, una volta avviato, la visualizzazione può essere ricaricata ogni volta che si desidera senza attendere il tempo di avvio del server.

Per navigare attraverso la visualizzazione è possibile utilizzare:

- i tasti da "1" a "8" per variare la categoria visualizzata. (KeyCode dal 49 al 56)
- il tasto "p" per visualizzare le statistiche di un particolare giocatore. (KeyCode 80)
- il tasto "h" per avere un aiuto, simile a questa lista, riguardo la navigazione. (KeyCode 72)

### Giocatori

Di seguito alcuni nomi di giocatori che possono essere inseriti nell'apposita casella per essere ricercati:

- Kobe Bryant
- Tim Duncan
- Wilt Chamberlain
- LeBron James
- Kevin Durant
- Derrick Rose
- Danilo Gallinari
- Luke Walton
- Steve Nash
- Kareem Abdul-Jabbar
- Bill Russel
- Michael Jordan

### Esempio

Di seguito un esempio di come la visualizzazione si presenta nel caso in cui si stia analizzando il profilo di Michael Jordan.

![Esempio Michael Jordan](img/vis.png)


