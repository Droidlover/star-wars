import { StarWarsService } from './../../services/star-wars.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planet-search',
  templateUrl: './planet-search.component.html',
  styleUrls: ['./planet-search.component.css']
})
export class PlanetSearchComponent implements OnInit {
  searchText;
  planets = [];
  filteredPlanets = [];
  maxPlanetPopulation;
  visibaleDetailsElement;
  isLoading = false;
  constructor(private starWarService: StarWarsService) { }

  ngOnInit() {
  }

  getPlanets() {
    this.isLoading = true;
    this.starWarService.getPlanets().subscribe((resp: any) => {
      this.planets = [...this.planets, ...resp.results];
      const nextPageUrl = resp.next;
      if (nextPageUrl) {
        this.getNextPlanetsAndCheck(resp);
      } else {
        this.getFilteredPlanets();
      }
    });
  }

  getNextPlanetsAndCheck(resp) {
    if (resp.next) {
      this.starWarService.getNextPlanets(resp.next).subscribe((respNext: any) => {
        this.planets = [...this.planets, ...resp.results];
        this.getNextPlanetsAndCheck(respNext);
      });
    } else {
      this.getFilteredPlanets();
    }

  }

  getFilteredPlanets() {
    this.filteredPlanets = [];
    this.planets.filter((ele) => {
      if (ele.name.toLowerCase().indexOf(this.searchText) > -1) {
        if (ele.population === 'unknown' || !ele.population) {
          ele.population = 0;
        }
        this.filteredPlanets.push(ele);
      }

    });

    // this.filteredPlanets = this.filteredPlanets.sort((a, b) => {
    //   if (+a.diameter < +b.diameter) {
    //     return +1;
    //   } else if (+a.diameter > +b.diameter) {
    //     return -1;
    //   } else if (+a.diameter === +b.diameter) {
    //     return 0;
    //   }
    // });
    console.log(this.filteredPlanets);
    const flatArray = this.filteredPlanets.map((row) => row.population);

    if (this.filteredPlanets && this.filteredPlanets.length > 0) {
      // this.minPlanetSize = this.flatArray[(this.filteredPlanets.length - 1)].diameter;
      this.maxPlanetPopulation = Math.max.apply(this, flatArray);
    }
    this.isLoading = false;

  }

  search() {
    if (this.planets.length < 1) {
      this.getPlanets();
    } else {
      this.getFilteredPlanets();
    }
  }

  getFontSize(planet) {

    const minSize = 4;
    const size = minSize + (24 * (planet.population / this.maxPlanetPopulation));
    return (size + 'px');
  }

  showDetails(index) {
    this.visibaleDetailsElement = index;
  }

  logout() {
    this.starWarService.logOut();
  }
}
