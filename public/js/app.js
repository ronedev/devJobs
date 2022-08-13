import axios from 'axios'
import Swal from 'sweetalert2'

document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");

  const alerts = document.querySelector(".alertas")

  if (skills) {
    skills.addEventListener("click", addSkills);

    selectedSkills()
  }
  if(alerts){
    activeAlerts()
  }

  const vacantesListado = document.querySelector('.panel-administracion')

  if(vacantesListado){
    vacantesListado.addEventListener('click', accionesListado)
  }
});

const skills = new Set();

const addSkills = (e) => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      skills.delete(e.target.textContent);
      e.target.classList.remove("activo");
    } else {
      skills.add(e.target.textContent);
      e.target.classList.add("activo");
    }
  }

  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const selectedSkills = ()=>{
  const selected = Array.from(document.querySelectorAll('.lista-conocimientos .activo'))

  selected.forEach(selec =>{
    skills.add(selec.textContent)
  })

  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
}

const activeAlerts = ()=>{
  const alerts = document.querySelector('.alertas')

  const interval = setInterval(()=>{
    if(alerts.children.length > 0){
      alerts.removeChild(alerts.children[0])
    }else if(alerts.children === 0){
      alerts.parentElement.removeChild(alerts)
      clearInterval(interval)
    }
  }, 2000)
}

//Eliminar vacantes
const accionesListado = (e)=>{
  e.preventDefault()

  if(e.target.dataset.delete){
    //Eliminar la vacante
    Swal.fire({
      title: '¿Desea eliminar la vacante?',
      text: "Una vez eliminada no podrá recuperarla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.delete}`

        axios.delete(url, {params: {url}})
          .then(res =>{
            if(res.status === 200){
              Swal.fire(
                '¡Vacante eliminada!',
                res.data,
                'success'
              )

              //Eliminar vacante del dom
              e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
            }
          })
          .catch(err => {
            Swal.fire(
              'Ha ocurrido un problema',
              'No se ha podido eliminar la vacante correctamente, por favor intentelo nuevamente',
              'error'
            )
          })
      }
    })
  }else{
    if(e.target.tagName === "A"){
      window.location.href = e.target.href
    }
  }
}