'use strict'
document.addEventListener('DOMContentLoaded', () => {
  const initialContacts = [
    { name: "Roaia Habashi", email: "ro2ya.habashi@gmail.com", phone: "0525127600", age: "19", address: "Haifa", image: "images/roaia.jpg" },
    { name: "Rawan Habashi", email: "rawan.hb18@gmail.com", phone: "050-3587185", age: "20", address: "Kfar Manda", image: "images/rawan.jpg" },
    { name: "Buroog Sawaeed", email: "brwgswd@gmail.com", phone: "0525822206", age: "22", address: "Nazareth", image: "images/buroog.jpg" },
    { name: "Nebal Egbaria", email: "nebal1234@gmail.com", phone: "0506566304", age: "35", address: "Zalafa", image: "images/nebal.jpg" },
    { name: "Rihan Zoabe", email: "rihanZ10@gmail.com", phone: "054-9270013", age: "16", address: "Tur'an", image: "images/rihan.jpg" },
    { name: "Ghaidaa Darawshe", email: "ghidaa.dr7@gmail.com", phone: "052-4571795", age: "17", address: "Ako", image: "images/ghaidaa.jpg" },
    { name: "Wejdan Fakhory", email: "wejdan20@gmail.com", phone: "052-2678828", age: "15", address: "Nahariya", image: "images/wejdan.jpg" },
    { name: "Ahmad Najar", email: "ahmad.najar2@gmail.com", phone: "052-5450730", age: "21", address: "Daburia", image: "images/ahmad.jpg" },
    { name: "Firas Moosa", email: "firas.f2112@gmail.com", phone: "054-3281833", age: "21", address: "Majd Alkrum", image: "images/firas.jpg" },
    { name: "Hala Habiballa", email: "hala.987@gmail.com", phone: "052-3694565", age: "18", address: "Tamra", image: "images/hala.jpg" }
  ];

  let contacts = [];
  let editingContactIndex = null;


  const renderContacts = (filter = "") => {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.email.toLowerCase().includes(filter.toLowerCase()) ||
      contact.phone.includes(filter)
    );

    filteredContacts.forEach((contact, index) => {
      const li = document.createElement("li");
      li.classList.add("contact-item");
      li.innerHTML = `
        <div class="contact-avatar">
          <img src="${contact.image || 'default-avatar.png'}" alt="avatar">
        </div>
        <div class="contact-details">
          <div class="contact-name">${contact.name}</div>
          <div class="contact-email">Email: ${contact.email}</div>
          <div class="contact-phone">Phone: ${contact.phone}</div>
          <div class="contact-age">Age: ${contact.age}</div>
          <div class="contact-address">Address: ${contact.address}</div>
          <div class="contact-actions">
            <button onclick="editContact(${index})">Edit</button>
            <button onclick="showInfo(${index})">Info</button>
            <button onclick="deleteContact(${index})">Delete</button>
          </div>
        </div>`;
      contactList.appendChild(li);
    });
  };


  const saveToLocalStorage = () => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  };


  const loadFromLocalStorage = () => {
    const savedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (savedContacts && savedContacts.length > 0) {
      contacts = savedContacts;
    } else {
      contacts = [...initialContacts];
      saveToLocalStorage(); 
    }
    renderContacts();
  };


  const saveContact = (name, email, phone, age, address, image) => {
    if (!name || !email || !phone) {
      alert('Name, Email, and Phone are required.');
      return;
    }

    if (editingContactIndex === null) {
      contacts.push({ name, email, phone, age, address, image });
    } else {
      contacts[editingContactIndex] = { name, email, phone, age, address, image };
      editingContactIndex = null; // Clear editing index after saving
    }

    renderContacts();
    saveToLocalStorage();
    document.getElementById("contactForm").reset();
    document.getElementById("popup").style.display = "none";
  };


  window.editContact = (index) => {
    editingContactIndex = index;
    const contact = contacts[index];
    document.getElementById("name").value = contact.name;
    document.getElementById("email").value = contact.email;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("age").value = contact.age || '';
    document.getElementById("address").value = contact.address || '';
    document.getElementById("popupTitle").textContent = "Edit Contact";
    document.getElementById("popup").style.display = "block";
  };


  window.showInfo = (index) => {
    const contact = contacts[index];
    document.getElementById("infoName").textContent = `Name: ${contact.name}`;
    document.getElementById("infoEmail").textContent = `Email: ${contact.email}`;
    document.getElementById("infoPhone").textContent = `Phone: ${contact.phone}`;
    document.getElementById("infoAge").textContent = `Age: ${contact.age}`;
    document.getElementById("infoAddress").textContent = `Address: ${contact.address || 'N/A'}`;
    document.getElementById("infoModal").style.display = "block";
  };


  window.deleteContact = (index) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      contacts.splice(index, 1);
      renderContacts();
      saveToLocalStorage();
    }
  };


  window.deleteContacts = () => {
    if (confirm("Are you sure you want to delete all contacts?")) {
      contacts = [];
      localStorage.removeItem('contacts'); 
      renderContacts(); 
    }
  };


  document.getElementById("contactForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const age = document.getElementById("age").value;
    const address = document.getElementById("address").value;
    const imageInput = document.getElementById("avatar");

    let image = "";
    if (imageInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(e) {
        image = e.target.result;
        saveContact(name, email, phone, age, address, image);
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      image = editingContactIndex !== null ? contacts[editingContactIndex].image : "";
      saveContact(name, email, phone, age, address, image);
    }
  });


  document.getElementById("searchInput").addEventListener("input", (event) => {
    renderContacts(event.target.value);
  });


  document.getElementById("openPopupButton").addEventListener("click", () => {
    editingContactIndex = null; 
    document.getElementById("popupTitle").textContent = "Add New Contact";
    document.getElementById("popup").style.display = "block";
  });


  document.getElementById("closePopupButton").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
  });

  document.getElementById("closeInfoModal").addEventListener("click", () => {
    document.getElementById("infoModal").style.display = "none";
  });

  window.onclick = (event) => {
    if (event.target === document.getElementById("infoModal")) {
      document.getElementById("infoModal").style.display = "none";
    }
  };


  loadFromLocalStorage();
});
