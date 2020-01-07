import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  countryList = [];

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
    this.http.get('http://localhost:7200/repositories/countrydb?',{params})
              .subscribe(data=> {
                console.log("d",data);
              })
  }

  
  ngOnInit() {
  }

  getAll() {
    this.getAllCountries();
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

    this.http.get('http://localhost:7200/repositories/countrydb?',{params})
        .subscribe(data=>{
          let countries = data['results']['bindings'];

          for( let i = 0; i< countries.length; i++ ){
            this.countryList.push(countries[i]['name']['value'])
            console.log('cou',this.countryList);
          }
        })
  }
}
