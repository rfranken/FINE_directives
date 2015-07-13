var app = angular.module("demo", ['ngResource','FINE$directives']);


/*
 Het enige wat in de controller moet worden gedaan om de domainlists te laten werken
 is het opnemen van een object om het geselecteerde domainlist item in op te slaan:
*/

app.controller("domainlistDemo", function($scope,domainResource) {
    $scope.contactpersoon = {};
    $scope.contracttype = {};
});
