const URL_API = "https://62b03a14e460b79df0408808.mockapi.io/students";

const btnSave = document.querySelector('#btn-save');
const btnReset = document.querySelector('#btn-reset');
const inputReset = document.querySelectorAll('input');

const txtCodeStudent = document.querySelector('#codeStudentInput');
const txtFullName = document.querySelector('#fullNameInput');
const txtClassName = document.querySelector('#classNameInput');

let idStudent;

// Load Student
document.querySelector('body').onload = function () {
  getStudents();
}

const getStudents = async () => {
  try {
    await axios.get(`${URL_API}`)
      .then(res => renderStudent(res.data))
  } catch (error) {
    console.log(error);
  }
}

const renderStudent = (students) => {
  var tBody = document.querySelector("tbody");
  if (students.length > 0) {
    var renderHTML = students.map((student, index) => {
      return `
      <tr>
        <th scope="row">${++index}</th>
        <td>${student.codeStudent}</td>
        <td>${student.fullName}</td>
        <td>${student.className}</td>
        <td>
        <button type="button" onclick="handleUpdate(${student.id})" class="btn btn-warning">Edit</button>
        </td>
        <td>
        <button type="button" onclick="handleDelete(${student.id})" class="btn btn-danger">Delete</button>
        </td>
      </tr>
    `
    })
    tBody.innerHTML = renderHTML.join('')
  }
  else {
    tBody.innerHTML =
      `<tr>
        <td colspan ="6" style="text-align:center">No data student returned!!!</td>
      </tr>`
  }
}
// Reset Input
const resetInput = () => {
  inputReset.forEach((inp) => {
    inp.value = "";
  })
}

btnReset.addEventListener('click', function resetForm(e) {
  e.preventDefault();
  resetInput();
});
// Create Student
const newStudent = () => {
  let student = {
    codeStudent: txtCodeStudent.value.trim(),
    fullName: txtFullName.value.trim(),
    className: txtClassName.value.trim()
  };
  return student;
};

const createStudent = async () => {
  try {
    await axios.post(`${URL_API}`, newStudent())
    getStudents();
  }
  catch (error) {
    console.log(error);
  }
}
btnSave.onclick = (e) => {
  e.preventDefault();
  if (idStudent) {
    axios.put(`${URL_API}/${idStudent}`, newStudent())
      .then(res => getStudents(res.data))
    resetInput();
    idStudent = "";
  }
  else {
    let sizeCode = txtCodeStudent.value.trim().length;
    let sizeName = txtFullName.value.trim().length;
    let sizeClass = txtClassName.value.trim().length;
    checkEmptyError([txtCodeStudent, txtFullName, txtClassName])
    if (sizeCode > 0 && sizeName > 0 && sizeClass > 0) {
      createStudent();
      resetInput();
    }
  }
}
// Validate
const checkEmptyError = (listInput) => {
  listInput.forEach((input) => {
    input.value = input.value.trim();
    if (!input.value) {
      showError(input, "Please enter before save!")
    }
    else {
      showSuccess(input)
    }
  })
}
const showError = (input, message) => {
  let parent = input.parentElement;
  let em = parent.querySelector('em');
  em.classList.add('error');
  em.innerHTML = message;
}
const showSuccess = (input) => {
  let parent = input.parentElement;
  let em = parent.querySelector('em');
  em.classList.remove('error');
  em.innerHTML = '';
}
// Delete 
const handleDelete = async (id) => {
  await axios.delete(`${URL_API}/${id}`)
    .then(res => getStudents(res.data))
}
// Update
const handleUpdate = async (id) => {
  idStudent = id;
  let res = await axios.get(`${URL_API}/${id}`);
  txtCodeStudent.value = res.data.codeStudent;
  txtFullName.value = res.data.fullName;
  txtClassName.value = res.data.className;
}