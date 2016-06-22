var minusNum = function(self){
    var outputField;

    for(var i = 0; i < self.parentNode.children.length; i++) {
        if(self.parentNode.children[i].className === 'qty') {
            outputField = self.parentNode.children[i];
            break;
        }
    }

    if(outputField) {
        var currentNum = parseInt(outputField.value);
        if((currentNum-1) >= 0){
            outputField.value = currentNum-1;
        }
    }
}

var addNum = function (self){
    var outputField;

    for(var i = 0; i < self.parentNode.children.length; i++) {
        if(self.parentNode.children[i].className === 'qty') {
            outputField = self.parentNode.children[i];
            break;
        }
    }

    if(outputField) {
        var currentNum = parseInt(outputField.value);
        outputField.value = currentNum+1;
    }
}