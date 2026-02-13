document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // SEND MAIL FUNCTION TO SEND MAIL WHEN SUBMIT BUTTON IS CLICKED:
  document.querySelector('#compose-form').addEventListener('submit', send_mail);
  // By default, load the inbox
  load_mailbox('inbox');
});
// COMPOSE EMAIL FUNCTION
function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#individualEmail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
// SEND MAIL FUNCTION
function send_mail(e){
  //prevent form from submitting by default
  e.preventDefault();
//POST to send
fetch(`/emails`, {
  method:'POST',
  body:JSON.stringify({
    recipients: document.querySelector('#compose-recipients').value,  
    subject: document.querySelector('#compose-subject').value,
    body: document.querySelector('#compose-body').value
  })
}) 
.then(response => response.json())
.then(result => { 
  console.log(result);
  load_mailbox('sent');
});
}
// LOAD MAILBOX FUNCTION
function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#individualEmail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  // Show name of the mailbox i.e. inbox, sent or archive
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`; 
  // GET : To load emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails =>{
    emails.forEach(email => {
      const email_message = document.createElement('div');      
      email_message.style.padding = '15px';            
      email_message.style.margin = '7px';        
      email_message.style.cursor = 'pointer';
      email_message.style.border = '2px solid yellow'; 
      if (email.read){
        email_message.style.backgroundColor = 'gray';
        }else{
          email_message.style.backgroundColor = 'white';
      }              
      email_message.innerHTML = `
      <strong> From:</strong> ${email.sender}
      <br>
      <strong> To:</strong> ${email.recipients.join(', ')}
      <br>
      <strong> Reply To:</strong> ${email.sender}
      <br>
      <strong>Subject:</strong> ${email.subject}
      <br>
      <strong>Time Stamp:</strong> ${email.timestamp}
      `;
      //View email messages
      email_message.addEventListener('click', function(){
        view_myEmail(email.id, mailbox);
      });
      document.querySelector('#emails-view').append(email_message);          
    });   
  });
  }
// VIEW INDIVIDUAL EMAIL FUNCTION  
function view_myEmail(id, mailbox){
  document.querySelector('#individualEmail-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email =>{   
    //MARK READ 
    fetch(`/emails/${id}`,{      
      method:'PUT',
      body:JSON.stringify({
        read:true      
      })
    });  
    const individual = document.querySelector('#individualEmail-view');
    individual.innerHTML = `
    <strong> From:</strong> ${email.sender}
    <br>
    <strong> To:</strong> ${email.recipients.join(', ')}
    <br>
    <strong> Reply To:</strong> ${email.sender}
    <br>
    <strong>Subject:</strong> ${email.subject}
    <br>
    <strong>Time Stamp:</strong> ${email.timestamp}
    <br>
    <strong>Body:</strong><p>${email.body}</p>  
    <br>  
    `;
    //ARCHIVE / UNARCHIVE
    if (mailbox != 'sent'){
      const archive_switch = document.createElement('button');
      archive_switch.innerText = email.archived? 'Unarchive' : 'Archive';
      archive_switch.addEventListener('click', function(){
        fetch(`/emails/${id}`, {
          method:'PUT',
          body: JSON.stringify({
           archived: !email.archived          
          })
        }).then(function(){
          load_mailbox('inbox');
        })
      });
      individual.append(archive_switch);
    }
    //REPLY
    const reply_switch = document.createElement('button');
    reply_switch.innerText = 'Reply';
    reply_switch.style.marginLeft = '95px';
    reply_switch.addEventListener('click', function(){
      reply_myMail(email);
    })
    individual.append(reply_switch);
  });
}
// REPLY EMAIL FUNCTION
function reply_myMail(email){
  compose_email();
  document.querySelector('#compose-recipients').value = email.sender;
  if(email.subject){
    document.querySelector('#compose-subject').value = email.subject;   
  }else{
     document.querySelector('#compose-subject').value = `No Subject`;
  }   
  document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote:\n${email.body}\n ___`; 
}
window.onload = function(){
  //CODE
  document.querySelector('#submit-btn').onclick = function noSubject_noBody(){    
    const body = document.querySelector('#compose-body');
    const subject = document.querySelector('#compose-subject');
    if(body.value === "" && subject.value === ""){
      document.querySelector('#compose-form').onsubmit = event.preventDefault();      
      //CREATE A PARAGRAPH AND APPEND TO DIV WITH ID #noSubject_noBody
      const error_message = document.createElement('p');
      error_message.innerHTML = `
      <strong>ERROR:</strong><br></br>Both Subject and Body cannot be empty.\n 
      Please fill in either Subject or Body before submitting!
      `;
      error_message.className = 'error';
      error_message.style.color = 'red';   
      error_message.style.border = '2px solid yellow'; 
      error_message.style.padding = '7px'; 
      const noSubject_noBody = document.querySelector('#noSubject_noBody');     
      noSubject_noBody.append(error_message);         
  }  
}
}





