(function () {
    //Configurable Values:
    var restUrl="/_api/web/lists/GetByTitle('Cascading Choices')/items";//URL for the Source Options list containing all cascading drop-down options
    var Level1InternalName = "Continent";//Cascading Drop-down list's level 1 column name, also update line 19
    var Level2InternalName = "Country";//Cascading Drop-down list's level 2 column name, also update line 23
    var Level3InternalName = "State";//Cascading Drop-down list's level 3 column name, also update line 27, set both to "" if only 2 cascading drop-downs
    var Level4InternalName = "City";//Cascading Drop-down list's level 4 column name, also update line 31, set both to "" if only 3 cascading drop-downs
    var Level1Source = "Level1";//internal name of the column containing the level 1 choices in the Source Options list
    var Level2Source = "Level2";//internal name of the column containing the level 2 choices in the Source Options list
    var Level3Source = "Level3";//internal name of the column containing the level 3 choices in the Source Options list, set to "" if only 2 cascading drop-downs
    var Level4Source = "Level4";//internal name of the column containing the level 4 choices in the Source Options list, set to "" if only 3 cascading drop-downs

    // Create object that have the context information about the field that we want to change it's output render 
    var cascadingFieldContext = {};
    cascadingFieldContext.Templates = {};
    cascadingFieldContext.Templates.Fields = {
        // Apply the new rendering for all fields on New and Edit forms
        "Continent": {
            "NewForm": renderLevel1Field,
            "EditForm": renderLevel1Field
        },
        "Country": {
            "NewForm": renderLevel2Field,
            "EditForm": renderLevel2Field
        },
        "State": {
            "NewForm": renderLevel3Field,
            "EditForm": renderLevel3Field
        },
        "City": {
            "NewForm": renderLevel4Field,
            "EditForm": renderLevel4Field
        }
    };

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(cascadingFieldContext);

    //Always start by populating the top drop-down in the cascading hierarchy
    getDDLChoices(populateLevel1Choices);

    function renderLevel1Field(ctx) {
        var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        var fieldInternalName = ctx.CurrentFieldSchema.Name;
        var controlId = "ddl"+Level1InternalName;
        ctx.FormContext.registerInitCallback(fieldInternalName, function () {
              $addHandler($get(controlId), "change", function(e) {
                  ctx.FormContext.updateControlValue(fieldInternalName, $("#"+controlId).val());
                  $("#ddl"+Level2InternalName).trigger("clear");
                  getDDLChoices(populateLevel2Choices);
              });
          });
        var validators = new SPClientForms.ClientValidation.ValidatorSet(); 
        validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator()); 
        formCtx.registerValidationErrorCallback(formCtx.fieldName, 
            function (errorResult) { 
                SPFormControl_AppendValidationErrorMessage(controlId+"Validator", errorResult);
            }
        ); 
        formCtx.registerClientValidator(formCtx.fieldName, validators);

        // Register a callback just before submit.
        formCtx.registerGetValueCallback(formCtx.fieldName, function () {
            return $("#"+controlId).val();
        });
        if(formCtx.fieldValue != ""){
            return '<select name="'+Level1InternalName+'" id="'+controlId+'"><option value="'+ formCtx.fieldValue +'" Selected>'+ formCtx.fieldValue +'</option></select><div id="'+controlId+'Validator"></div>';
        }else
            return '<select name="'+Level1InternalName+'" id="'+controlId+'"><option value=""></option></select><div id="'+controlId+'Validator"></div>';
    }
    function renderLevel2Field(ctx) {
        var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        var fieldInternalName = ctx.CurrentFieldSchema.Name;
        var controlId = "ddl"+Level2InternalName;
        ctx.FormContext.registerInitCallback(fieldInternalName, function () {
              $addHandler($get(controlId), "change", function(e) {
                  ctx.FormContext.updateControlValue(fieldInternalName, $("#"+controlId).val());
                  $("#ddl"+Level3InternalName).trigger("clear");
                  getDDLChoices(populateLevel3Choices);
              });
              $("#"+controlId).on("clear", function(e) {
                $("#ddl"+Level3InternalName).trigger("clear");
                $("#"+controlId).empty();
                $("#"+controlId).prop("disabled", true);
                $("#"+controlId).prepend("<option value='' disabled selected>[No options available]</option>");
                $("#"+controlId).val('');
              });
                getDDLChoices(populateLevel2Choices);
          });
        var validators = new SPClientForms.ClientValidation.ValidatorSet(); 
        validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator()); 
        formCtx.registerValidationErrorCallback(formCtx.fieldName, 
            function (errorResult) { 
                SPFormControl_AppendValidationErrorMessage(controlId+"Validator", errorResult);
            }
        ); 
        formCtx.registerClientValidator(formCtx.fieldName, validators);

        // Register a callback just before submit.
        formCtx.registerGetValueCallback(formCtx.fieldName, function () {
            return $("#"+controlId).val();
        });
        if(formCtx.fieldValue != ""){
            return '<select name="'+Level2InternalName+'" id="'+controlId+'"><option value="'+ formCtx.fieldValue +'" Selected>'+ formCtx.fieldValue +'</option></select><div id="'+controlId+'Validator"></div>';
        }else
            return '<select name="'+Level2InternalName+'" id="'+controlId+'"><option value=""></option></select><div id="'+controlId+'Validator"></div>';
    }
    function renderLevel3Field(ctx) {
        var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        var fieldInternalName = ctx.CurrentFieldSchema.Name;
        var controlId = "ddl"+Level3InternalName;//fieldInternalName + "_control";
        ctx.FormContext.registerInitCallback(fieldInternalName, function () {
              $addHandler($get(controlId), "change", function(e) {
                  ctx.FormContext.updateControlValue(fieldInternalName, $("#"+controlId).val());
                  $("#ddl"+Level4InternalName).trigger("clear");
                  getDDLChoices(populateLevel4Choices);
              });
              $("#"+controlId).on("clear", function(e) {
                $("#ddl"+Level4InternalName).trigger("clear");
                $("#"+controlId).empty();
                $("#"+controlId).prop( "disabled", true);
                $("#"+controlId).prepend("<option value='' disabled selected>[No options available]</option>");
                $("#"+controlId).val('');
              });
                getDDLChoices(populateLevel3Choices);
          });
        var validators = new SPClientForms.ClientValidation.ValidatorSet(); 
        validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator()); 
        formCtx.registerValidationErrorCallback(formCtx.fieldName, 
            function (errorResult) { 
                SPFormControl_AppendValidationErrorMessage(controlId+"Validator", errorResult);
            }
        ); 
        formCtx.registerClientValidator(formCtx.fieldName, validators);

        // Register a callback just before submit.
        formCtx.registerGetValueCallback(formCtx.fieldName, function () {
            return $("#"+controlId).val();
        });
        if(formCtx.fieldValue != ""){
            return '<select name="'+Level3InternalName+'" id="'+controlId+'"><option value="'+ formCtx.fieldValue +'" Selected>'+ formCtx.fieldValue +'</option></select><div id="'+controlId+'Validator"></div>';
        }else
            return '<select name="'+Level3InternalName+'" id="'+controlId+'"><option value=""></option></select><div id="'+controlId+'Validator"></div>';      
    }
    function renderLevel4Field(ctx) {
        var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        var fieldInternalName = ctx.CurrentFieldSchema.Name;
        var controlId = "ddl"+Level4InternalName;
        ctx.FormContext.registerInitCallback(fieldInternalName, function () {
              $addHandler($get(controlId), "change", function(e) {
                  ctx.FormContext.updateControlValue(fieldInternalName, $("#"+controlId).val());
              });
              $("#"+controlId).on("clear", function(e) {
                $("#"+controlId).empty();
                $("#"+controlId).prop("disabled", true);
                $("#"+controlId).prepend("<option value='' disabled selected>[No options available]</option>");
                $("#"+controlId).val('');
              });
              getDDLChoices(populateLevel4Choices);
          });

        var validators = new SPClientForms.ClientValidation.ValidatorSet(); 
        validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator()); 
        formCtx.registerValidationErrorCallback(formCtx.fieldName, 
            function (errorResult) { 
                SPFormControl_AppendValidationErrorMessage(controlId+"Validator", errorResult);
            }
        ); 
        formCtx.registerClientValidator(formCtx.fieldName, validators);

        // Register a callback just before submit.
        formCtx.registerGetValueCallback(formCtx.fieldName, function () {
            return $("#"+controlId).val();
        });
        if(formCtx.fieldValue != ""){
            return '<select name="'+Level4InternalName+'" id="'+controlId+'"><option value="'+ formCtx.fieldValue +'" Selected>'+ formCtx.fieldValue +'</option></select><div id="'+controlId+'Validator"></div>';
        }else
            return '<select name="'+Level4InternalName+'" id="'+controlId+'"><option value=""></option></select><div id="'+controlId+'Validator"></div>';
    }

    function getDDLChoices(populateFunction){
        
        var field="";
        var modifiedRestUrl = restUrl;
        switch(populateFunction)
        {
            case populateLevel1Choices:
                console.log("Level 1 Choices");
                modifiedRestUrl += "?$select="+Level1Source+"&$orderby="+Level1Source+" asc";
                field=Level1Source;
                break;
            case populateLevel2Choices:
                console.log("Level 2 Choices");
                modifiedRestUrl += "?$select="+Level2Source+"&$filter="+Level1Source+" eq '"+$("#ddl"+Level1InternalName).val()+"'&distinct=true&$orderby="+Level2Source+" asc"
                field=Level2Source;
                break;
            case populateLevel3Choices:
                if(Level3InternalName == "" || Level3Source == "") {return {};}
                console.log("Level 3 Choices");
                modifiedRestUrl += "?$select="+Level3Source+"&$filter="+Level1Source+" eq '"+$("#ddl"+Level1InternalName).val()+"' and "+Level2Source+" eq '"+$("#ddl"+Level2InternalName).val()+"'&$orderby="+Level3Source+" asc"
                field=Level3Source;
                break;
            case populateLevel4Choices:
                if(Level4InternalName == "" || Level4Source == "") {return {};}
                console.log("Level 4 Choices");
                modifiedRestUrl += "?$select="+Level4Source+"&$filter="+Level1Source+" eq '"+$("#ddl"+Level1InternalName).val()+"' and "+Level2Source+" eq '"+$("#ddl"+Level2InternalName).val()+"' and "+Level3Source+" eq '"+$("#ddl"+Level3InternalName).val()+"'&$orderby="+Level4Source+" asc"
                field=Level4Source;
                break;
            default:
                modifiedRestUrl=modifiedRestUrl;
        }
        console.log(modifiedRestUrl);
        return $.ajax({
            url: modifiedRestUrl, 
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose"
            },
            success: function(result){
                if (result && result.d && result.d.results) {
                    var resultDeduped = [];
                    $.each(result.d.results, function(index, item) {
                        //removes duplicates and null/empty  items
                        if (($.inArray(item[field], resultDeduped)==-1) && (item[field] !== null)) {
                            resultDeduped.push(item[field]);
                        }
                    });
                    populateFunction(resultDeduped);
                }
            }
        });
    }

    function populateLevel1Choices(result) {    
        var currentVal = $("#ddl"+Level1InternalName).val();
        console.log("Current Level 1: " + currentVal);
        $("#ddl"+Level1InternalName).empty();
        for (var i = 0; i < result.length; i++)
        {
            console.log(result[i]);
            //Add this option to the select element and mark it selected if it matches the currentVal
            $("#ddl"+Level1InternalName).append("<option value='" + result[i] + ((result[i]==currentVal) ? "'' Selected":"'") +">" + result[i] + "</option");
        }
        if(currentVal == $("#ddl"+Level1InternalName).val())
        {
            getDDLChoices(populateLevel2Choices);
        }else
        {
            //Adds empty option to current field when item doesn't already have value 
            $("#ddl"+Level1InternalName).prepend("<option Selected='Selected' value=''></option");
            $("#ddl"+Level1InternalName).val('');
        }        
    }
    function populateLevel2Choices(result) {   
        var currentVal = $("#ddl"+Level2InternalName).val();
        console.log("Current Level 2: " + currentVal);
        $("#ddl"+Level2InternalName).empty();
        $("#ddl"+Level2InternalName).prop( "disabled", false);
        if(result.length > 0){
            for (var i = 0; i < result.length; i++)
            {
                console.log(result[i]);
                $("#ddl"+Level2InternalName).append("<option value='" + result[i] + ((result[i]==currentVal) ? "'' Selected":"'") +">" + result[i] + "</option");
                }
            if(currentVal == $("#ddl"+Level2InternalName).val())
            {
                getDDLChoices(populateLevel3Choices);
            }else
            {
                //Adds empty but descriptive option to current field
                $("#ddl"+Level2InternalName).prepend("<option Selected='Selected' value=''></option");
                $("#ddl"+Level2InternalName).val('');
            }
        }else
        {
            $("#ddl"+Level2InternalName).append("<option value='' disabled selected>[No options available]</option>");
            $("#ddl"+Level2InternalName).prop("disabled", true);
        }
    }
    function populateLevel3Choices(result) {
        var currentVal = $("#ddl"+Level3InternalName).val();
        console.log("Current Level 3: " + currentVal);
        $("#ddl"+Level3InternalName).empty();
        $("#ddl"+Level3InternalName).prop( "disabled", false);
        if(result.length > 0){
            for (var i = 0; i < result.length; i++)
            {
                console.log(result[i]);
                $("#ddl"+Level3InternalName).append("<option value='" + result[i] + ((result[i]==currentVal) ? "'' Selected":"'") +">" + result[i] + "</option");
            }
            if(currentVal == $("#ddl"+Level3InternalName).val())
            {
                getDDLChoices(populateLevel4Choices);
            }else
            {
                //Adds empty but descriptive option to current field
                $("#ddl"+Level3InternalName).prepend("<option Selected='Selected' value=''></option");
                $("#ddl"+Level3InternalName).val('');
            }
        }else
        {
            $("#ddl"+Level3InternalName).append("<option value='' disabled selected>[No options available]</option>");
            $("#ddl"+Level3InternalName).prop("disabled", true);
        }
    }
    function populateLevel4Choices(result) {
        var currentVal = $("#ddl"+Level4InternalName).val();
        console.log("Current Level 4: " + currentVal);
        $("#ddl"+Level4InternalName).empty();
        $("#ddl"+Level4InternalName).prop("disabled", false);
        if(result.length > 0){
            for (var i = 0; i < result.length; i++)
            {
                console.log(result[i]);
                $("#ddl"+Level4InternalName).append("<option value='" + result[i] + ((result[i]==currentVal) ? "'' Selected":"'") +">" + result[i] + "</option");
            }
            if(currentVal == $("#ddl"+Level4InternalName).val())
            {
                
            }else
            {
                //Adds empty but descriptive option to current field
                $("#ddl"+Level4InternalName).prepend("<option Selected='Selected' value=''></option");
                $("#ddl"+Level4InternalName).val('');
            }
        }else
        {
            $("#ddl"+Level4InternalName).append("<option value='' disabled selected>[No options available]</option>");
            $("#ddl"+Level4InternalName).prop("disabled", true);
        }        
    }    
})();


