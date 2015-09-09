var app = angular.module("demo", ['ngResource','fine.directives']);


/*
 Het enige wat in de controller moet worden gedaan om de domainlists te laten werken
 is het opnemen van een object om het geselecteerde domainlist item in op te slaan:
*/

app.controller("domainlistDemo", function($scope) {
    $scope.contactpersoon = {};
    $scope.contracttype = {};
});
