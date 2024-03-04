function sort(columnIndex) {
  alert("Sort by column " + columnIndex);
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("products-datatable");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[columnIndex];
      y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  setAttribute();
}

console.log(document.getElementById("products-datatable"));

function setAttribute() {
  var table = document.getElementById("products-datatable");
  for (var i = 1; i < table.rows.length - 1; i++) {
    if (i % 2 !== 0) {
      table.rows[i].classList.add("odd");
    } else {
      table.rows[i].classList.remove("odd");
    }
  }
}

setAttribute();

var ctx = document.getElementById("myChart");
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['ATTT', 'CNTT', 'KT', 'ĐPT', 'MR', 'TT'],
    datasets: [{
      label: 'Lượng truy cập trong ngày',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("products-datatable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

var deleteButtons = document.getElementsByClassName('delete-user');

// Thêm sự kiện click vào mỗi nút xóa
for (var i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function () {
    // Xóa hàng chứa nút xóa đã được nhấp
    this.parentNode.parentNode.parentNode.remove();
    
  });
};
