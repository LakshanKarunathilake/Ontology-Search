import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  private sparkqlData = null;

  sparkql() {
    let headers: Headers = new Headers({
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    });

    //let params = new URLSearchParams();
    let query = {'query': 'SELECT * WHERE { <http://dbpedia.org/resource/Awolnation> ?pref ?obj } LIMIT 10'};
    let format = {'format': 'json'};

    let options = {
      params: [query,format]
    };

    this.http.get('http://dbpedia.org/sparql', headers, options) // 1
      .subscribe(data => {
          console.log(data);
          this.sparkqlData = data; // 3
       });
     console.log(this.sparkqlData);  // 2
  }

}
