$(document).ready(function(){
$.getJSON("/category/submit_category",
function(response){
     response.data.map((item)=>{
          $('#categoryid').append($('<option>').text(item.categoryname).val(item.image))
     })
})
})