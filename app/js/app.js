var app = angular.module('ControleInsulina', [
    'ngMaterial',
    'ngMessages',
    'Barbara-Js',
    'ui.utils.masks',
    'LocalStorageModule'
]);

app.config(function ($mdThemingProvider, $mdIconProvider, localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('app_cas');

    $mdThemingProvider
        .theme('default')
        .primaryPalette('green')
        .accentPalette('red')
        .warnPalette('amber');

    $mdThemingProvider
        .theme('input')
        .primaryPalette('green')
        .accentPalette('red')
        .warnPalette('amber');

    $mdThemingProvider
        .theme('docs-dark', 'default')
        .primaryPalette('green')
        .accentPalette('red')
        .warnPalette('amber')
        .dark();

    $mdThemingProvider
        .theme('docs-light', 'default')
        .primaryPalette('green')
        .accentPalette('red')
        .warnPalette('amber');

    $mdThemingProvider.enableBrowserColor({});
    $mdIconProvider.defaultIconSet('app/icons/mdi.svg');
});

app.run(function ($rootScope, $mdSidenav, bootstrap, ControleInsulinaService) {
    ControleInsulinaService.setTiposInsulinas();

    $rootScope.historicoInsulinas = ControleInsulinaService.getHistoricoInsulinas();

    $rootScope.abrirMenu = function () {
        $mdSidenav('menu').toggle();
    };

    $rootScope.loading = bootstrap.loading();
});

app.filter('tempoInsulina', function () {
    return function (valor) {

        var tiposTempo = {
            s: 'segundo(s)',
            m: 'minuto(s)',
            h: 'hora(s)',
            d: 'dia(s)'
        };

        var retorno = 'Tempo inválido!';

        if (!valor || !angular.isObject(valor)){
            return retorno;
        }

        else if (!valor.inicio || !angular.isNumber(valor.inicio)){
            return retorno;
        }

        else if (!valor.fim || !angular.isNumber(valor.fim)){
            return retorno;
        }

        else if (!valor.tipo){
            return retorno;
        }

        else if(valor.inicio < 0 && valor.fim < 0){
            retorno = "Indefinido.";
        }

        else if(valor.inicio >= 0 && valor.fim >= 0){
            retorno = "De " + valor.inicio + " a " + valor.fim + " " + tiposTempo[valor.tipo] + ".";
        }

        else if(valor.inicio >= 0){
            retorno = "A partir de " + valor.inicio + " " + tiposTempo[valor.tipo] + ".";
        }

        else if(valor.fim >= 0){
            retorno = "Até " + valor.fim + " " + tiposTempo[valor.tipo] + ".";
        }

        return retorno;

    };
});

app.service('ControleInsulinaService', function (localStorageService, $rootScope) {

    var historicoInsulinasKey = 'historico_diabetes';

    var tiposDiabetes = [
        {
            nome: "Diabetes Tipo 1",
            descricao: "Em algumas pessoas, o sistema imunológico ataca equivocadamente as células beta. Logo, pouca " +
            "ou nenhuma insulina é liberada para o corpo. Como resultado, a glicose fica no sangue, em vez de ser usada " +
            "como energia. Esse é o processo que caracteriza o Tipo 1 de diabetes, que concentra entre 5 e 10% do total " +
            "de pessoas com a doença. O Tipo 1 aparece geralmente na infância ou adolescência, mas pode ser diagnosticado " +
            "em adultos também. Essa variedade é sempre tratada com insulina, medicamentos, planejamento alimentar e " +
            "atividades físicas, para ajudar a controlar o nível de glicose no sangue."
        },
        {
            nome: "Diabetes Tipo 2",
            descricao: "O Tipo 2 aparece quando o organismo não consegue usar adequadamente a insulina que produz; ou " +
            "não produz insulina suficiente para controla a taxa de glicemia. Cerca de 90% das pessoas com diabetes têm " +
            "o Tipo 2. Ele se manifesta mais frequentemente em adultos, mas crianças também podem apresentar. Dependendo " +
            "da gravidade, ele pode ser controlado com atividade física e planejamento alimentar. Em outros casos, exige " +
            "o uso de insulina e/ou outros medicamentos para controlar a glicose."
        }
    ];

    var tiposInsulinas = {
        ultra_rapida: {
            nome: "Ultrarrápida (Análogos Ultrarrápidos)",
            tipo: "Bolus",
            insulinas: []

        },
        rapida: {
            nome: "Rápida (Insulina Humana Regular)",
            tipo: "Bolus",
            insulinas: []

        },
        intermediaria: {
            nome: "Ação intermediária (NPH – humana)",
            tipo: "Basal",
            insulinas: []

        },
        longa_duracao: {
            nome: "Longa duração (Análogos lentos)",
            tipo: "Basal",
            insulinas: []
        },
        pre_misturada_regular: {
            nome: "Insulina pré-misturada regular",
            tipo: "Pré-misturada",
            insulinas: []
        },
        pre_misturada_analoga: {
            nome: "Insulina pré-misturada análoga",
            tipo: "Pré-misturada",
            insulinas: []
        }
    };

    this.getTiposDiabetes = function () {
        return tiposDiabetes;
    };

    this.setTiposInsulinas = function () {

        tiposInsulinas['ultra_rapida'].insulinas.push({
            nome: "Apidra® (Glulisina)",
            tipo : 'ultra_rapida',
            variacao : 0.27,
            horario_injecao: 'Utilizada junto às refeições. Deve ser injetada imediatamente antes das refeições.',
            acao: {
                tipo: 'm',
                inicio: 10,
                fim: 15
            },
            pico: {
                tipo: 'h',
                inicio: 1,
                fim: 2
            },
            duracao: {
                tipo: 'h',
                inicio: 3,
                fim: 5
            }
        });

        tiposInsulinas['ultra_rapida'].insulinas.push({
            nome: "Humalog® (Lispro)",
            tipo : 'ultra_rapida',
            variacao : 0.51,
            horario_injecao: 'Utilizada junto às refeições. Deve ser injetada imediatamente antes das refeições.',
            acao: {
                tipo: 'm',
                inicio: 10,
                fim: 15
            },
            pico: {
                tipo: 'h',
                inicio: 1,
                fim: 2
            },
            duracao: {
                tipo: 'h',
                inicio: 3,
                fim: 5
            }
        });

        tiposInsulinas['ultra_rapida'].insulinas.push({
            nome: "NovoRapid® (Asparte)",
            tipo : 'ultra_rapida',
            variacao : 0.13,
            horario_injecao: 'Utilizada junto às refeições. Deve ser injetada imediatamente antes das refeições.',
            acao: {
                tipo: 'm',
                inicio: 10,
                fim: 15
            },
            pico: {
                tipo: 'h',
                inicio: 1,
                fim: 2
            },
            duracao: {
                tipo: 'h',
                inicio: 3,
                fim: 5
            }
        });

        tiposInsulinas['rapida'].insulinas.push({
            nome: "Humulin®",
            tipo : 'rapida',
            variacao : 0.76,
            horario_injecao: 'Utilizada junto às refeições ao dia. Deve ser injetada entre 30 e 45 minutos antes do ' +
            'início das refeições.',
            acao: {
                tipo: 'm',
                inicio: 30,
                fim: 30
            },
            pico: {
                tipo: 'h',
                inicio: 2,
                fim: 3
            },
            duracao: {
                tipo: 'h',
                inicio: 6.5,
                fim: 6.5
            }
        });

        tiposInsulinas['rapida'].insulinas.push({
            nome: "Novolin®",
            tipo : 'rapida',
            variacao : 0.15,
            horario_injecao: 'Utilizada junto às refeições ao dia. Deve ser injetada entre 30 e 45 minutos antes do ' +
            'início das refeições.',
            acao: {
                tipo: 'm',
                inicio: 30,
                fim: 30
            },
            pico: {
                tipo: 'h',
                inicio: 2,
                fim: 3
            },
            duracao: {
                tipo: 'h',
                inicio: 6.5,
                fim: 6.5
            }
        });

        tiposInsulinas['intermediaria'].insulinas.push({
            nome: "Humulin® N",
            tipo : 'intermediaria',
            variacao : 0.98,
            horario_injecao: 'Frequentemente, a aplicação começa uma vez ao dia, antes de dormir. Pode ser indicada ' +
            'uma ou duas vezes ao dia. Não é específica para refeições.',
            acao: {
                tipo: 'h',
                inicio: 1,
                fim: 3
            },
            pico: {
                tipo: 'h',
                inicio: 5,
                fim: 8
            },
            duracao: {
                tipo: 'h',
                inicio: 18,
                fim: 18
            }
        });

        tiposInsulinas['intermediaria'].insulinas.push({
            nome: "Novolin® N",
            tipo : 'intermediaria',
            variacao : 0.31,
            horario_injecao: 'Frequentemente, a aplicação começa uma vez ao dia, antes de dormir. Pode ser indicada ' +
            'uma ou duas vezes ao dia. Não é específica para refeições.',
            acao: {
                tipo: 'h',
                inicio: 1,
                fim: 3
            },
            pico: {
                tipo: 'h',
                inicio: 5,
                fim: 8
            },
            duracao: {
                tipo: 'h',
                inicio: 18,
                fim: 18
            }
        });

        tiposInsulinas['longa_duracao'].insulinas.push({
            nome: "Lantus® (Glargina)",
            tipo : 'longa_duracao',
            variacao : 0.47,
            horario_injecao: 'Frequentemente, a aplicação começa uma vez ao dia, antes de dormir. Levemir pode ser ' +
            'indicada uma ou duas vezes ao dia. Tresiba é utilizada sempre uma vez ao dia, podendo variar o horário ' +
            'de aplicação. Não é específica para refeições.',
            acao: {
                tipo: 'm',
                inicio: 90,
                fim: 90
            },
            pico: {
                tipo: 'm',
                inicio: -1,
                fim: -1
            },
            duracao: {
                tipo: 'h',
                inicio: -1,
                fim: 24
            }
        });

        tiposInsulinas['longa_duracao'].insulinas.push({
            nome: "Levemir® (Detemir)",
            tipo : 'longa_duracao',
            variacao : 0.75,
            horario_injecao: 'Frequentemente, a aplicação começa uma vez ao dia, antes de dormir. Levemir pode ser ' +
            'indicada uma ou duas vezes ao dia. Tresiba é utilizada sempre uma vez ao dia, podendo variar o horário ' +
            'de aplicação. Não é específica para refeições.',
            acao: {
                tipo: 'm',
                inicio: 90,
                fim: 90
            },
            pico: {
                tipo: 'm',
                inicio: -1,
                fim: -1
            },
            duracao: {
                tipo: 'h',
                inicio: 16,
                fim: 24
            }
        });

        tiposInsulinas['longa_duracao'].insulinas.push({
            nome: "Tresiba® (Degludeca)",
            tipo : 'longa_duracao',
            variacao : 0.99,
            horario_injecao: 'Frequentemente, a aplicação começa uma vez ao dia, antes de dormir. Levemir pode ser ' +
            'indicada uma ou duas vezes ao dia. Tresiba é utilizada sempre uma vez ao dia, podendo variar o horário ' +
            'de aplicação. Não é específica para refeições.',
            acao: {
                tipo: 'm',
                inicio: 90,
                fim: 90
            },
            pico: {
                tipo: 'm',
                inicio: -1,
                fim: -1
            },
            duracao: {
                tipo: 'h',
                inicio: 24,
                fim: -1
            }
        });

    };

    this.getTiposInsulinas = function () {
        return tiposInsulinas;
    };

    this.getHistoricoInsulinas = function () {
        var historico = localStorageService.get(historicoInsulinasKey);

        return historico ? historico : [];
    };

    this.calcularInsulina = function($scope){
        if(angular.isUndefined($scope.insulina)){
            return 'Indefinido';
        }
        else if (angular.isUndefined($scope.insulina.tipo)){
            return 'Indefinido';
        }
        else if (angular.isUndefined($scope.insulina.glicose)){
            return 'Indefinido';
        }
        else {
            return (($scope.insulina.glicose + 0.28) * 1.34 * $scope.insulina.tipo.variacao).toFixed(2) + 'ml';
        }
    };

    this.adicionarAplicacaoInsulina = function ($scope) {
        if($scope.insulina.create) {
            $scope.insulina.created_at = new Date();
            $rootScope.historicoInsulinas.push(angular.copy($scope.insulina));
            $scope.insulina = undefined;
        } else  {
            $scope.insulina.updated_at = new Date();
        }

        return localStorageService.set(historicoInsulinasKey, $rootScope.historicoInsulinas);
    };

    this.apagarTudo = function () {
        if(confirm("Deseja realmente apagar todos os dados?")){
            localStorageService.clearAll();
            location.reload();
        }
    };
});

app.service('UsuarioService', function (localStorageService) {

    var dadosUsuarioKey = 'dados_usuario';

    this.getDadosCadastrais = function () {
        var dadosUsuario = localStorageService.get(dadosUsuarioKey);

        return dadosUsuario && dadosUsuario != null ? dadosUsuario : undefined;
    };

    this.adicionarUsuario = function ($scope) {
        if($scope.dadosUsuario.create) {
            $scope.dadosUsuario.created_at = new Date();
        } else  {
            $scope.dadosUsuario.updated_at = new Date();
        }

        return localStorageService.set(dadosUsuarioKey, $scope.dadosUsuario);
    };
});

app.controller('ControleInsulinaController', function ($scope, $mdToast, ControleInsulinaService, UsuarioService, $mdDialog) {

    $scope.dadosUsuario = UsuarioService.getDadosCadastrais();

    $scope.tiposInsulinas = ControleInsulinaService.getTiposInsulinas();

    $scope.calcularInsulina = function ($event, insulina) {
        $mdDialog
            .show({
                controller: 'FormularioGlicoseController',
                locals: {
                    insulina: insulina,
                    historicoInsulinas: $scope.historicoInsulinas
                },
                templateUrl: './formulario.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false
            });
    };

    $scope.adicionarUsuario = function ($event) {
        $mdDialog
            .show({
                controller: 'FormularioUsuarioController',
                locals: {
                    dadosUsuario: $scope.dadosUsuario
                },
                templateUrl: './usuario.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false
            })
            .then(function () {
                $scope.dadosUsuario = UsuarioService.getDadosCadastrais();
            }, function () {
                $scope.dadosUsuario = UsuarioService.getDadosCadastrais();
            });
    };

    $scope.apagarTudo = function () {
        ControleInsulinaService.apagarTudo();
    };
});

app.controller('FormularioGlicoseController', function(
    $scope,
    $mdDialog,
    $mdToast,
    ControleInsulinaService,
    historicoInsulinas,
    insulina
) {

    $scope.historicoInsulinas = historicoInsulinas;
    $scope.tiposInsulinas = ControleInsulinaService.getTiposInsulinas();

    if(angular.isUndefined(insulina)){
        $scope.insulina = {};
        $scope.insulina.create = true;
        $scope.insulina.update = false;
        $scope.insulina.data = new Date();
    } else {
        $scope.insulina = insulina;
        $scope.insulina.create = false;
        $scope.insulina.update = true;
    }

    $scope.calcularInsulina = function(){
        $scope.insulina.quant = ControleInsulinaService.calcularInsulina($scope);
        return $scope.insulina.quant;
    };

    $scope.salvar = function () {

        if(ControleInsulinaService.adicionarAplicacaoInsulina($scope)) {
            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent("A insulina foi registrada com sucesso!")
                    .position('top right')
                    .hideDelay('5000')
            );
            $mdDialog.cancel();
        } else {
            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent("Não foi possível registrar a insulina, tente novamente!")
                    .position('top right')
                    .hideDelay('5000')
            );
        }
    };

    $scope.fechar = function () {
        $mdDialog.cancel();
    };
});


app.controller('FormularioUsuarioController', function (
    $scope,
    $mdDialog,
    $mdToast,
    ControleInsulinaService,
    UsuarioService,
    dadosUsuario
) {

    $scope.tiposDiabetes = ControleInsulinaService.getTiposDiabetes();

    if(angular.isUndefined(dadosUsuario)){
        $scope.dadosUsuario = {};
        $scope.dadosUsuario.create = true;
        $scope.dadosUsuario.update = false;
    } else {
        $scope.dadosUsuario = dadosUsuario;
        $scope.dadosUsuario.create = false;
        $scope.dadosUsuario.update = true;
    }

    $scope.salvar = function () {

        if(UsuarioService.adicionarUsuario($scope)) {
            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent("O usuário foi registrada com sucesso!")
                    .position('top right')
                    .hideDelay('5000')
            );
            $mdDialog.cancel();
        } else {
            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent("Não foi possível registrar o usuário, tente novamente!")
                    .position('top right')
                    .hideDelay('5000')
            );
        }
    };

    $scope.fechar = function () {
        $mdDialog.cancel();
    };
});