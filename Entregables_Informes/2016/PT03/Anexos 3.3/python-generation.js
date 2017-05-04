'use strict';
(function(pythonGeneration) {

    var INDENT_DEFAULT_CHARACTER = '    ';
    var PARAMS_REGEXP = /{(.*?)}/;
    var params = {
        indentCharacter: INDENT_DEFAULT_CHARACTER
    };

    var imports = {},
        instances = {};

    function getCode(bloqFullStructure) {
        console.log('getting code', bloqFullStructure);
        imports = {};
        instances = {};

        var code = '# coding=utf-8\n\n';

        var bloqsCode = getCodeFromBLoq(bloqFullStructure);
        var propiedad;
        //after bloqscode to reuse the bucle to fill libraries and instance dependencies
        var importsCode = '';
        for (propiedad in imports) {
            importsCode += 'import ' + propiedad + '\n';
        }

        var instancesCode = '';
        for (propiedad in instances) {
            instancesCode += propiedad + ' = ' + instances[propiedad] + '.' + instances[propiedad] + '()\n';
        }


        code += importsCode + '\n\n';
        code += instancesCode + '\n\n';
        code += bloqsCode + '\n\n';
        return code;
    }

    function getCodeFromBLoq(bloqFullStructure) {
        console.log('getting code from bloq', bloqFullStructure);

        var codeLines = bloqFullStructure.python.codeLines,
            aliases = bloqFullStructure.content[0],
            childs = bloqFullStructure.childs,
            childsCode = '',
            aliasesValuesHashMap = {},
            value,
            code = '',
            tempCode,
            match,
            numberOfIndents;

        if (bloqFullStructure.python.libraries) {
            for (var i = 0; i < bloqFullStructure.python.libraries.length; i++) {
                imports[bloqFullStructure.python.libraries[i]] = true;
            }
        }

        if (bloqFullStructure.python.needInstanceOf) {
            for (var i = 0; i < bloqFullStructure.python.needInstanceOf.length; i++) {
                instances[bloqFullStructure.python.needInstanceOf[i].name] = bloqFullStructure.python.needInstanceOf[i].type;
            }
        }

        if (aliases) {
            for (var i = 0; i < aliases.length; i++) {
                if (aliases[i].id) {
                    aliasesValuesHashMap[aliases[i].id] = aliases[i].value;
                } else if (aliases[i].bloqInputId && aliases[i].value) {
                    aliasesValuesHashMap[aliases[i].bloqInputId] = getCodeFromBLoq(aliases[i].value);
                }
            }
        }
        if (childs) {
            for (var i = 0; i < childs.length; i++) {
                childsCode += getCodeFromBLoq(childs[i]);
            }
            aliasesValuesHashMap.STATEMENTS = childsCode;
        }

        for (var i = 0; i < codeLines.length; i++) {
            numberOfIndents = (codeLines[i].indentation || 0);
            if (codeLines[i].conditional) {
                tempCode = codeLines[i].conditional.code[aliasesValuesHashMap[codeLines[i].conditional.aliasId]];
            } else {
                tempCode = codeLines[i].code;
            }

            //searchGroups
            match = PARAMS_REGEXP.exec(tempCode);
            while (match) {
                console.log('match!', match);
                console.log(aliasesValuesHashMap[match[1]]);
                tempCode = tempCode.replace(match[0], aliasesValuesHashMap[match[1]]);
                match = PARAMS_REGEXP.exec(tempCode);
            }

            tempCode = tempCode.replace(/^/gm, params.indentCharacter.repeat(numberOfIndents));

            if (bloqFullStructure.type != 'output') {
                tempCode += '\n';
            }

            code += tempCode;
        }
        return code;
    }

    pythonGeneration.getCode = getCode;
    pythonGeneration.params = params;

    return pythonGeneration;

})(window.pythonGeneration = window.pythonGeneration || {}, undefined);