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

  countryList = [];

  // country list table
  displayedColumns: string[] = ['name'];
  COUNTRY_DATA = [];
  dataSource = new MatTableDataSource<any>(this.COUNTRY_DATA);

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

  onToggleClicked(value, classT) {
    this.toggledClass = classT;
  }

  getAll() {
    switch(this.toggledClass) {
      case 'Countries':
        this.getAllCountries();
        break;
      case 'Capital':
        break;
    }
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
            this.countryList.push('name',countries[i]['name']['value'])
          }
          console.log('cou',this.countryList);
          this.COUNTRY_DATA = this.countryList;
        })
  }
}
