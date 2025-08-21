const apiURL = "http://localhost:3000/api/students";
let currentPage, currentSearch;

function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
  }
  return token;
}

const token = checkAuth();

//Fetch all the students from the API
async function fetchStudents(search = "", page = 1) {
  currentSearch = search;
  currentPage = page;
  let limit = 7;
  const result = await fetch(
    `${apiURL}?search=${encodeURIComponent(search)}&page=${encodeURIComponent(
      page
    )}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await result.json();
  let totalPages = data.totalPages;

  const tbody = document.querySelector("#studentTableBody");
  tbody.innerHTML = "";

  data.studentsData.forEach((student) => {
    tbody.innerHTML += `
                <tr>
            <td>
        <img src="http://localhost:3000/uploads/${student.profile_pic}"
             style="width:50px; height:50px; object-fit:cover;"
             class="rounded-circle" alt=" 404"/>
      </td>

            <td>${student.first_name}</td>
            <td>${student.last_name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.gender}</td>
            <td>
              <button class="btn btn-info btn-sm" onclick="viewStudent('${student._id}')">
                View
              </button>
              <button class="btn btn-warning btn-sm" onclick="editStudent('${student._id}')">
                Edit
              </button>
              <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student._id}')">
                Delete
              </button>
            </td>
          </tr>
                `;
  });

  renderPagination(totalPages);
}
fetchStudents();

async function renderPagination(totalPages) {
  const container = document.querySelector("#pagination");
  container.innerHTML = "";

  //previous button
  let prevLi = document.createElement("li");
  prevLi.innerHTML = `<a class="page-link " href="#">Previous</a>`;
  if (currentPage === 1) {
    prevLi.className = "disabled page-item";
  } else {
    prevLi.className = "page-item";
    prevLi.addEventListener("click", (e) => {
      e.preventDefault();
      fetchStudents(currentSearch, currentPage - 1);
    });
  }
  container.appendChild(prevLi);

  //Paginaton buttons in numbers
  for (let i = 1; i <= totalPages; i++) {
    let li = document.createElement("li");
    li.innerHTML = `<a class="page-link " href="#">${i}</a>`;
    let asdf = i === currentPage ? "page-item active" : "page-item";
    li.className = asdf;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      fetchStudents(currentSearch, i);
    });
    container.appendChild(li);
  }

  //next Button

  let nextli = document.createElement("li");
  nextli.innerHTML = `<a class="page-link " href="#">Next</a>`;
  if (currentPage === totalPages) {
    nextli.className = "page-item disabled";
  } else {
    nextli.className = "page-item";
    nextli.addEventListener("click", (e) => {
      e.preventDefault();
      fetchStudents(currentSearch, currentPage + 1);
    });
  }
  container.appendChild(nextli);
}

//Fetch single student from the API
async function viewStudent(id) {
  const result = await fetch(`${apiURL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const student = await result.json();

  document.querySelector(
    "#viewProfilePic"
  ).src = `http://localhost:3000/uploads/${student.profile_pic}`;
  document.querySelector(
    "#viewName"
  ).textContent = `${student.first_name} ${student.last_name}`;
  document.querySelector("#viewEmail").textContent = student.email;
  document.querySelector("#viewPhone").textContent = student.phone;
  document.querySelector("#viewGender").textContent = student.gender;

  new bootstrap.Modal(document.getElementById("viewStudentModal")).show();
}

//search Functionality
document.querySelector("#searchInput").addEventListener("input", () => {
  fetchStudents(document.querySelector("#searchInput").value);
});

//Add new student
document
  .querySelector("#addStudentModal")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch(apiURL, {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      e.target.reset();
      bootstrap.Modal.getInstance(
        document.querySelector("#addStudentModal")
      ).hide();
      fetchStudents();
    } else {
      alert("Error creating student");
    }
  });

//Delete student
async function deleteStudent(id) {
  if (confirm("are you sure to delete this student")) {
    await fetch(`${apiURL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchStudents();
  } else {
    return;
  }
}

//Update Student Modal box
async function editStudent(id) {
  const result = await fetch(`${apiURL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const student = await result.json();

  document.querySelector("#editStudentId").value = student._id;
  document.querySelector("#editFirstName").value = student.first_name;
  document.querySelector("#editLastName").value = student.last_name;
  document.querySelector("#editEmail").value = student.email;
  document.querySelector("#editPhone").value = student.phone;
  document.querySelector("#editGender").value = student.gender;

  new bootstrap.Modal(document.getElementById("editStudentModal")).show();
}

document
  .querySelector("#editStudentModal")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch(`${apiURL}/${e.target.id.value}`, {
      method: "PUT",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      bootstrap.Modal.getInstance(
        document.querySelector("#editStudentModal")
      ).hide();
      fetchStudents();
    } else {
      alert("Error Updating student");
    }
  });
//Logout Function

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
