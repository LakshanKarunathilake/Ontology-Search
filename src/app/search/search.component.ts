import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private http: HttpClient) {  
    let params = new HttpParams().set('query',`PREFIX geographis: <http://telegraphis.net/ontology/geography/geography#>
    PREFIX gn: <http://www.geonames.org/ontology#>
    PREFIX country: <http://telegraphis.net/data/countries/AD#>
    
    select * 
    where { 
        country:AD geographis:currency ?o 
    } limit 100`)
    this.http.get('http://localhost:7200/repositories/countrydb?',{params})
              .subscribe(data=> {
                console.log("d",data);
              })
  }

  ngOnInit() {
  }

}
