console.log("Inside inside public js")

function runQueryForRightClick() {
[...document.querySelectorAll('.js-noMenu')].forEach((el) =>
  el.addEventListener('contextmenu', (e) => e.preventDefault())
)
}

document.querySelector('#editPost').addEventListener('click',(e)=>{
    console.log('clicked edit!', e.target)
})

function reply_click(clicked_id)
  {
      
    console.log(clicked_id);
    location.assign('/update')  
  }


function rightCheck(event) {
  if (event.button === 2) {
    location.assign('/compose')
  }
}


runQueryForRightClick()
