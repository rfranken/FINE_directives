/* Credits: https://www.codementor.io/angularjs/tutorial/create-domainlist-control

 Generieke directive voor het plaatsen van een domainlist veld met daarin domein waarden.

 Voorwaarden:
 [1] de domeinquery levert altijd een combinatie van de kolommen "id - name" op.
 [2] de directive wordt als volgt aangeroepen

 <domainlist placeholder="Kies contactpersoon..."   --> De placeholder wordt getoond als er niets is geselecteerd
           domain-name="contracttypes"            --> De domain-name wordt toegevoegd aan der URL, dus bijv: "http://localhost:3001/contracttypes"
           selected-id=""                         --> De initiële/default-waarde van het id-attribuut van het geselecteerde item
           return-object="contracttype"           --> De naam van de items die onderdeel zijn van de domainlist.
                                                      Onder deze naam wordt het gekozen ID toegankelijk voor de scope:
                                                      dus. $scope.<return-object name>.id
 </domainlist>
 [3] de geselecteerde id-waarde wordt opgehaald via:
 "<return-object>.id"
*/
var app = angular.module("fine.directives", ['ngResource']);

app.constant('RESOURCE_URL','http://localhost:3001/');
app.constant('MAX_FETCH_SIZE',50);
// De domainResource wordt door alle domein-queries gedeeld:
app.factory('domainResource', function ($resource,RESOURCE_URL) {
    "use strict";
    // De domainProvider wordt per dropdown instance gedefinieerd:
    return $resource(RESOURCE_URL+":domainProvider",
        {  query:  {method: 'GET', isArray: false  }
        }
    );
});

app.directive("domainlist", function($rootScope,$filter, domainResource) {
    return {
        restrict: "E",
        templateUrl: "templates/domainlist.html",
        scope: {
            placeholder: "@",
            selectedId: "=",
            domainName: "@",
            returnObject: "="
        },
        link: function(scope) {
            scope.selected="";
            scope.domainRecordsParamsObj = {domainProvider : scope.domainName};
            scope.queryInOperation = true;
            scope.querySuccessful = false;
            scope.queryError = false;
            scope.domainItems = domainResource.query(scope.domainRecordsParamsObj
                , function(result){
                    scope.queryInOperation = false;
                    scope.querySuccessful = true;
                    // Zet een evt default waarde:
                    if (!(scope.selectedId===undefined)) {
                        scope.firstSelected = scope.getFirstSelected(scope.selectedId.toString());
                        scope.select(scope.firstSelected);
                    }
                    console.log('succes!')
                }
                , function(errorResult) {
                    if (errorResult.status) {
                        scope.errorMessage = errorResult.config.url + ": " + errorResult.status + ' ' + errorResult.data
                    }
                    else {
                        scope.errorMessage = 'Unknown error for path "'+ errorResult.config.url +'". Check your middleware log';
                    }
                    scope.queryError = true;
                    scope.queryInOperation = false;
                    console.log('Fout:' + scope.errorMessage);
                });

            // De eerst geselecteerde wordt afgeleid uit de directive HTML, attribuut: "selectedID".
            scope.getFirstSelected =   function(itemID) {
                var found = $filter('filter')(scope.domainItems, {ID: itemID}, true);
                if (found.length) {
                    return found[0];
                } else {
                    return '';
                }
            };

            scope.select = function(item) {
                // For the template:
                scope.selected = item;
                // write to controller scope:
                scope.returnObject = item;
            };

        }
    }
});