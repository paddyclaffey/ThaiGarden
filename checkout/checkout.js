/**
 * Created by Fidelity 2015 on 23/06/2016.
 */

thaiFood.checkout = {
    displayCheckout : function () {
        document.getElementById("checkout").style.display = 'flex';
        document.getElementById("proceedToCheckoutButton").style.display = 'none';
    },

    confirmOrder : function () {
        alert("confirmed");
    },

    cancelOrder : function () {
        document.getElementById("checkout").style.display = 'none';
        document.getElementById("proceedToCheckoutButton").style.display = 'flex';
    },

    resubmitDetails: function (confirmationCode){

    },

    displayCardForm : function(){
        if(document.getElementById("cardForm").style.display === 'none') {
            document.getElementById("cardForm").style.display = 'block';
        }
        else{
            document.getElementById("cardForm").style.display = 'none';
        }
    },

    displayDeliveryForm : function(){
        if(document.getElementById("deliveryForm").style.display === 'none') {
            document.getElementById("deliveryForm").style.display = 'block';
        }
        else{
            document.getElementById("deliveryForm").style.display = 'none';
        }
    }
}