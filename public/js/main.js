

function confirmDelete(event ,form){
   

  event.preventDefault(); // stop form from submitting immediately

  Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to delete this member ? ",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes ',
    cancelButtonText: 'Cancel',
    width : '300px',
    customClass :{
        popup : 'my-swal'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      form.submit(); // only submit if confirmed
    }
  });

  return false; // prevent default
}