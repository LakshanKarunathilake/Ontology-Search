import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// mat table
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  url: string = 'http://localhost:7200/repositories/countrydb?';

  toggledClass = 'Countries';
  selectedCountry = [];

  countryList = [];

  // country list table
  displayedColumns: string[] = ['name','area','alpha','buttons'];
  COUNTRY_DATA = [];
  dataSource;

  constructor(private http: HttpClient) {  
    let params = new HttpParams().set('query',
      `PREFIX geographis: <http://telegraphis.net/ontology/geography/geography#>
      PREFIX gn: <http://www.geonames.org/ontology#>
      PREFIX country: <http://telegraphis.net/data/countries/AD#>
      
      select * 
      where { 
          country:AD geographis:currency ?o 
      } limit 100`
    )
    this.http.get(this.url,{params})
              .subscribe(data=> {
                console.log("d",data);
              })
  }


  ngOnInit() {
  }

  searchtext = "";
  search() {
    switch(this.toggledClass) {
      case 'Countries':
        //alert(this.searchtext);
        this.exploreCountry(this.searchtext);
        break;
      case 'Capital':
        break;
      case 'Currency':
        break;
    }
  }

  onToggleClicked(value, classT) {
    this.countryList = [];
    this.currencyList = [];
    this.continentList = [];
    
    this.toggledClass = classT;
  }

  getAll() {
    switch(this.toggledClass) {
      case 'Countries':
        this.getAllCountries();
        break;
      case 'Capital':
        break;
      case 'Continent':
        this.getAllContinents();
        break;
      case 'Currency':
        this.getAllCurrencies();
        break;
    }
  }

  isPopulation  = true;
  isLandArea  = true;
  isCurrency  = true;
  isCapital  = true;

  onToggleClickedFilter(event, value) {
    switch(value) {
      case 'isPopulation':
        this.isPopulation = event;
        break;
      case 'isLandArea':
        this.isLandArea = event;
        break;
      case 'isCurrency':
        this.isCurrency = event;
        break;
      case 'isCapital':
        this.isCapital = event;
        break;
    }
  }

  exploreCountry(c) {

    let searchFields = "?name ";

    if(this.isPopulation) {
      searchFields += "?population "
    }
    if(this.isLandArea) { searchFields += "?area "}
    if(this.isCurrency) { searchFields += "?currency "}
    if(this.isCapital) { searchFields += "?capital "}

    let query = `
        PREFIX geographis: <http://telegraphis.net/ontology/geography/geography#>
        PREFIX gn: <http://www.geonames.org/ontology#>
        PREFIX measurement: <http://telegraphis.net/ontology/measurement/measurement#>
        PREFIX metric: <http://www.telegraphis.net/ontology/measurement/metric#> 
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX quantity: <http://www.telegraphis.net/ontology/measurement/quantity#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX code: <http://www.telegraphis.net/ontology/measurement/code#>
        
        PREFIX money: <http://telegraphis.net/ontology/money/money#>
        select `+ searchFields + `
        where { 
            ?country gn:name "` + c + `"@en;
                gn:population ?population;
              geographis:landArea ?land;
                geographis:capital ?ca;
                    geographis:currency ?cu;
                gn:name ?name .		 
            ?land rdf:value ?area .
            ?ca gn:name ?capital .
            ?cu money:name ?currency .
            ?land rdf:value ?area.
            
        } 
    
    `;

    let params = new HttpParams().set('query',query);

    this.http.get(this.url,{params})
        .subscribe(d => {
          let country = d['results']['bindings'][0];
          console.log("dd",country);
          this.selectedCountry.push({
            'area': country['area'] ? country['area']['value'] : null,
            'capital' : country['capital'] ? country['capital']['value'] : null,
            'name': country['name']['value'],
            'currency' : country['currency'] ? country['currency']['value'] : null,
            'population': country['population']? country['population']['value']: null
          });
          console.log("s",this.selectedCountry);
        });
    //this.selectedCountry = c;
  }

  // un select a country
  unselectCountry() {
    this.selectedCountry = [];
  }


  getAllCountries() {
    let query = `
        PREFIX geographis: <http://telegraphis.net/ontology/geography/geography#>
        PREFIX gn: <http://www.geonames.org/ontology#>
        PREFIX measurement: <http://telegraphis.net/ontology/measurement/measurement#>
        PREFIX metric: <http://www.telegraphis.net/ontology/measurement/metric#> 
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX quantity: <http://www.telegraphis.net/ontology/measurement/quantity#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX code: <http://www.telegraphis.net/ontology/measurement/code#>
        
        select ?name ?alpha ?l ?val
        where { 
            ?country geographis:capital ?v .
            ?country geographis:isoAlpha2 ?alpha .
            ?country geographis:landArea ?land .
            ?country gn:name ?name .
            ?land rdf:value ?l .
        } limit 100
    `;

    let params = new HttpParams().set('query',query);

    this.http.get(this.url,{params})
        .subscribe(data=>{
          let countries = data['results']['bindings'];
          console.log(countries[0]);
          for( let i = 0; i< countries.length; i++ ){
            this.countryList.push({
              'name':   countries[i]['name']['value'],
              'alpha':  countries[i]['alpha']['value'],
              'area':   countries[i]['l']['value']
            })
          }
          console.log('cou',this.countryList);
          this.COUNTRY_DATA = this.countryList;
          this.dataSource = new MatTableDataSource<any>(this.COUNTRY_DATA);
        })
  }

  continentList = [];

    // country list table
    displayed_contiColumns: string[] = ['name','population','buttons'];
    CONTI_DATA = [];
    contiSource;

  getAllContinents() {
    let query = `
        PREFIX gn: <http://www.geonames.org/ontology#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        prefix onto:<http://www.ontotext.com/> PREFIX geographis: <http://telegraphis.net/ontology/geography/geography#>
        select ?name ?population from onto:disable-sameAs { 
            ?s a <http://www.telegraphis.net/ontology/geography/geography#Continent>; 
              gn:name ?name;
              gn:population ?population;
        }
    
    `;

    let params = new HttpParams().set('query',query);

    this.http.get(this.url,{params})
        .subscribe(d => {
          let l = d['results']['bindings'];

          for(let y = 0; y< l.length; y++ ){
            this.continentList.push({
              'name': l[y]['name']['value'],
              'population' : l[y]['population']['value']
            });

          this.CONTI_DATA = this.continentList;
          this.contiSource = new MatTableDataSource<any>(this.CONTI_DATA)
          }

          console.log("contdd",this.continentList);
        })


  }


  currencyList = [];
  displayed_currColumns: string[] = ['name','symbol','alpha','buttons'];
  CURR_DATA = [];
  currSource;

  getAllCurrencies() {
    let query = `
      PREFIX money: <http://telegraphis.net/ontology/money/money#>
      prefix onto:<http://www.ontotext.com/> 
      select ?name ?symbol ?minor ?alpha ?isoNumeric from onto:disable-sameAs 
      { 
          ?s a <http://telegraphis.net/ontology/money/money#Currency>;
            money:isoAlpha ?alpha;
            money:isoNumeric ?isoNumeric;
            money:minorName ?minor;
            money:name ?name;
            money:symbol ?symbol .
          
      }
    
    `;
    
    let params = new HttpParams().set('query',query);

    this.http.get(this.url,{params})
        .subscribe(data=> {
          let l = data['results']['bindings'];

          for(let y = 0; y< l.length; y++ ) {
            this.currencyList.push({
              'name' : l[y]['name']['value'],
              'symbol' : l[y]['symbol']['value'],
              'isoNumeric' : l[y]['isoNumeric']['value'],
              'alpha' : l[y]['alpha']['value'],
              'minor' : l[y]['minor']['value']
            })
          }

          this.CURR_DATA = this.currencyList;
          this.currSource = new MatTableDataSource<any>(this.CURR_DATA);
          
          console.log("cur",this.currencyList);
        })
  }

  selectedCurrency = [];

  exploreCurrency(curr) {
    //alert(curr);
    let query = `
        PREFIX money: <http://telegraphis.net/ontology/money/money#>
        prefix onto:<http://www.ontotext.com/> 
        select ?symbol ?minor ?alpha ?isoNumeric from onto:disable-sameAs 
        { 
            ?s a <http://telegraphis.net/ontology/money/money#Currency>;
              money:isoAlpha ?alpha;
              money:isoNumeric ?isoNumeric;
              money:minorName ?minor;
              money:name "`+ curr +`"@en;
              money:symbol ?symbol .
            
        }    
    `;

    let params = new HttpParams().set('query',query);

    this.http.get(this.url,{params})
        .subscribe(data=> {
          let l = data['results']['bindings'];

          console.log("cntry",l);

          this.selectedCurrency.push({
            'name' : curr,
            'symbol' : l[0]['symbol']['value'],
            'isoNumeric' : l[0]['isoNumeric']['value'],
            'alpha' : l[0]['alpha']['value'],
            'minor' : l[0]['minor']['value']
          })    
        })

  }
}
