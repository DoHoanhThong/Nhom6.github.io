function toggleDateTimeFields() {
    if (document.getElementById('examType') == null) {
        console.log("null");
        return;
    }
    console.log("change");
    const examTypeSelect = document.getElementById('examType');
    const dateTimeFields = document.getElementById('dateTimeFields');

    if (examTypeSelect.value === 'Thời gian cụ thể') {
        dateTimeFields.style.display = 'block';
    } else {
        dateTimeFields.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('examType') != null) {
        document.getElementById('examType').addEventListener('change', toggleDateTimeFields);

    }
    if (document.getElementById('questionContainer') != null) {
        const questionContainer = document.getElementById('questionContainer');
    }

    if (document.getElementById('editContest') != null) {
        document.getElementById('editContest').addEventListener('click', function() {
            saveRowsData();
            localStorage.setItem('hasEdit', true);
            window.location.href = "./tao-ky-thi.html";
        });
    }

    if (document.getElementById('submit') != null) {
        document.getElementById('submit').addEventListener('click', function() {
            submit();
        });
    }

    if (document.getElementById('newContest') != null) {
        document.getElementById('newContest').addEventListener('click', function() {
            saveRowsData();
            localStorage.setItem('hasNew', true);
            window.location.href = "./tao-ky-thi.html";
        });
    }
    // Bắt sự kiện click trên nút "Tạo kỳ thi mới" và chuyển hướng

    if (document.getElementById('uploadExcelBtn') != null) {
        document.getElementById('uploadExcelBtn').addEventListener('click', function() {
            excelInput.click(); // Mở hộp thoại chọn file khi người dùng nhấn vào nút
        });
    }

    if (document.getElementById('excelInput') != null) {
        const excelInput = document.getElementById('excelInput');
        excelInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];

                    // Đọc dữ liệu từ file Excel
                    const examName = sheet['A1'].v.split(':')[1].trim();
                    const examDescription = sheet['A2'].v.split(':')[1].trim();
                    const examType = sheet['A3'].v.split(':')[1].trim();
                    document.getElementById('examType').value = examType;
                    const startDate = sheet['A4'].v.split(':')[1].trim();
                    const startTime = sheet['A5'].v.split(':')[1].trim() + ":" + sheet['A5'].v.split(':')[2].trim();
                    //console.log(startTime);
                    const endDate = sheet['A6'].v.split(':')[1].trim();
                    const endTime = sheet['A7'].v.split(':')[1].trim() + ":" + sheet['A5'].v.split(':')[2].trim();
                    const timeContest = sheet['A8'].v.split(':')[1].trim();

                    // Điền dữ liệu vào các input tương ứng
                    document.getElementById('examName').value = examName;
                    document.getElementById('examDescription').value = examDescription;
                    toggleDateTimeFields();
                    const startDateParts = startDate.split('/');
                    const endDateParts = endDate.split('/');
                    const startDateTime = new Date(parseInt(startDateParts[2]), parseInt(startDateParts[1]) - 1, parseInt(startDateParts[0]), parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]));
                    const endDateTime = new Date(parseInt(endDateParts[2]), parseInt(endDateParts[1]) - 1, parseInt(endDateParts[0]), parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]));

                    // Gán giá trị đã parse vào các trường input
                    document.getElementById('startDate').valueAsDate = startDateTime;
                    document.getElementById('startTime').value = startTime;
                    document.getElementById('endDate').valueAsDate = endDateTime;
                    document.getElementById('endTime').value = endTime;
                    document.getElementById('timeOfContest').value = parseInt(timeContest);
                    const lastRow = sheet['!ref'].split(':')[1];
                    const numberOfQuestions = parseInt(lastRow.substring(1));
                    // Thêm các câu hỏi
                    for (let i = 10; i <= numberOfQuestions; i++) {
                        AddQuestions(sheet, i);
                    }
                };

                reader.readAsArrayBuffer(file);
            }
        });
    }
    if (document.getElementById('addQuestionBtn') != null) {
        const addQuestionBtn = document.getElementById('addQuestionBtn');
        addQuestionBtn.addEventListener('click', function() {
            const numberOfQuestions = parseInt(document.getElementById('numberOfQuestions').value);
            const errorElement = document.getElementById('numberOfQuestionsError');

            if (numberOfQuestions < 0) {
                errorElement.style.display = 'block'; // Hiển thị thông báo lỗi
            } else {
                errorElement.style.display = 'none'; // Ẩn thông báo lỗi nếu không có lỗi
                for (let i = 0; i < numberOfQuestions; i++) {
                    addQuestion();
                }
            }
        });
    }

    function saveRowsData() {
        var table = document.getElementById("myTable");

        // Khởi tạo mảng để lưu các dòng
        var rowsData = [];

        // Lặp qua các dòng của bảng (trừ dòng đầu tiên là tiêu đề)
        for (var i = 1; i < table.rows.length; i++) {
            var row = table.rows[i];

            // Lấy giá trị từ mỗi ô và tạo một đối tượng
            var rowData = {
                tenKyThi: row.cells[0].innerText,
                moTa: row.cells[1].innerText,
                loaiKyThi: row.cells[2].innerText,
                ngayBatDau: row.cells[3].innerText,
                gioBatDau: row.cells[4].innerText,
                ngayKetThuc: row.cells[5].innerText,
                gioKetThuc: row.cells[6].innerText,
                thoiGianLamBai: row.cells[7].innerText,
                soCauHoi: row.cells[8].innerText
            };

            rowsData.push(rowData);
        }
        localStorage.setItem('rowsData', JSON.stringify(rowsData));
    }

    function submit() {

        const nameContest = document.getElementById('examName').value;
        const disCribe = document.getElementById('examDescription').value;
        const type = document.getElementById('examType').value;

        if (nameContest.trim() === "") {
            alert("Vui lòng nhập tên kỳ thi!");
            return;
        }
        // Lưu các giá trị vào localStorage
        localStorage.setItem('examName', nameContest);
        localStorage.setItem('examDescription', disCribe);
        localStorage.setItem('examType', type);
        if (type == 'Thời gian cụ thể') {
            const dayBegin = document.getElementById('startDate').value;
            const timeBegin = document.getElementById('startTime').value;
            const dayEnd = document.getElementById('endDate').value;
            const timeEnd = document.getElementById('endTime').value;
            const timeContest = document.getElementById('timeOfContest').value;
            if (!dayBegin) {
                alert("Vui lòng chọn ngày bắt đầu!");
                return; // Dừng hàm submit nếu ngày bắt đầu không được chọn
            }
            if (!timeBegin) {
                alert("Vui lòng chọn giờ bắt đầu!");
                return; // Dừng hàm submit nếu ngày bắt đầu không được chọn
            }
            if (!dayEnd) {
                alert("Vui lòng chọn ngày kết thúc!");
                return; // Dừng hàm submit nếu ngày bắt đầu không được chọn
            }
            if (!timeEnd) {
                alert("Vui lòng chọn giờ kết thúc!");
                return; // Dừng hàm submit nếu ngày bắt đầu không được chọn
            }
            const startDate = new Date(dayBegin + 'T' + timeBegin);
            const endDate = new Date(dayEnd + 'T' + timeEnd);

            // Kiểm tra điều kiện về thời gian
            if (startDate > endDate) {
                alert("Lỗi thời gian kỳ thi!");
                return;
            } else if (timeContest < 0) {
                alert("Lỗi thời gian thi!");
                return;
            }
            localStorage.setItem('startDate', dayBegin);
            localStorage.setItem('startTime', timeBegin);
            localStorage.setItem('endDate', dayEnd);
            localStorage.setItem('endTime', timeEnd);
            localStorage.setItem('timeOfContest', timeContest);
        }

        const numQuestions = questionContainer.querySelectorAll('.question').length;
        localStorage.setItem('numQuestions', numQuestions);
        localStorage.setItem('canInstantiate', true);
        if (document.getElementById('pageTitle').textContent === 'CHỈNH SỬA KỲ THI') {
            localStorage.setItem('hasChange', true);
        }
        window.location.href = "./trang-bai-thi.html";
        // Chuyển hướng đến trang trang-bai-thi.html

    }

    function addQuestion() {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionNumber = questionContainer.children.length + 1; // Số thứ tự bắt đầu từ 1
        const questionNumberLabel = document.createElement('span');
        questionNumberLabel.textContent = 'Câu hỏi ' + questionNumber + ': ';
        questionNumberLabel.style.marginTop = '15px';
        questionNumberLabel.style.display = 'inline-block';
        questionDiv.appendChild(questionNumberLabel);

        const content = document.querySelector('.content');
        content.style.height = 'fit-content';

        const questionInput = document.createElement('input');
        questionInput.setAttribute('type', 'text');
        questionInput.setAttribute('placeholder', 'Nhập câu hỏi');
        questionInput.setAttribute('required', ''); // Thêm thuộc tính required
        questionDiv.appendChild(questionInput);

        const answerInputs = [];

        for (let i = 1; i <= 4; i++) {
            const answerRow = document.createElement('div');
            answerRow.classList.add('answer-row'); // Thêm class để áp dụng CSS

            const answerInput = document.createElement('input');
            answerInput.setAttribute('type', 'radio');
            answerInput.setAttribute('name', 'answer');
            answerInput.setAttribute('value', i);
            answerRow.appendChild(answerInput);

            const answerLabel = document.createElement('label');
            answerLabel.textContent = 'Đáp án ' + i + ': ';
            answerRow.appendChild(answerLabel);

            const answerTextInput = document.createElement('input');
            answerTextInput.setAttribute('type', 'text');
            answerTextInput.setAttribute('placeholder', 'Nhập đáp án ' + i);
            answerTextInput.setAttribute('required', ''); // Thêm thuộc tính required
            answerRow.appendChild(answerTextInput);

            questionDiv.appendChild(answerRow);
            answerInputs.push(answerInput);
        }


        const correctAnswerSelect = document.createElement('select');
        correctAnswerSelect.setAttribute('required', '');
        // Tạo một option cho hướng dẫn
        const defaultOption = document.createElement('option');
        defaultOption.text = 'Đáp án đúng là';
        defaultOption.disabled = true;
        defaultOption.selected = true; // Đảm bảo không có lựa chọn mặc định
        correctAnswerSelect.appendChild(defaultOption);

        // Thêm các lựa chọn đáp án
        for (let i = 1; i <= 4; i++) {
            const option = document.createElement('option');
            option.text = 'Đáp án ' + i;
            option.value = i;
            correctAnswerSelect.appendChild(option);
        }
        questionDiv.appendChild(correctAnswerSelect);


        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Xóa câu hỏi';
        removeBtn.addEventListener('click', function() {
            questionDiv.remove();
            updateQuestionNumbers(); // Cập nhật số thứ tự của các câu hỏi sau khi xóa
        });
        questionDiv.appendChild(removeBtn);

        questionContainer.appendChild(questionDiv);

        //updateQuestionNumbers();
    }

    function updateQuestionNumbers() {
        const questions = questionContainer.querySelectorAll('.question');
        if (questions.length === 0) {
            const content = document.querySelector('.content');
            content.style.height = '100vh';
        } else {
            questions.forEach((question, index) => {
                const questionNumberLabel = question.querySelector('span');
                questionNumberLabel.textContent = 'Câu hỏi ' + (index + 1) + ': ';
            });

            const content = document.querySelector('.content');
            content.style.height = 'fit-content';

        }
    }

    function AddQuestions(sheet, row) {
        const questionContainer = document.getElementById('questionContainer');
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionNumberLabel = document.createElement('span');
        questionNumberLabel.textContent = 'Câu hỏi ' + row + ': ';
        questionNumberLabel.style.marginTop = '15px';
        questionNumberLabel.style.display = 'inline-block';
        questionDiv.appendChild(questionNumberLabel);

        const questionText = sheet['B' + row].v;
        const questionInput = document.createElement('input');
        questionInput.setAttribute('type', 'text');
        questionInput.setAttribute('value', questionText);
        questionInput.setAttribute('required', ''); // Thêm thuộc tính required
        questionDiv.appendChild(questionInput);

        const answerInputs = [];

        for (let i = 1; i <= 4; i++) {
            const answerRow = document.createElement('div');
            answerRow.classList.add('answer-row'); // Thêm class để áp dụng CSS

            const answerInput = document.createElement('input');
            answerInput.setAttribute('type', 'radio');
            answerInput.setAttribute('name', 'answer' + row);
            answerInput.setAttribute('value', i);
            answerRow.appendChild(answerInput);

            const answerLabel = document.createElement('label');
            answerLabel.textContent = 'Đáp án ' + i + ': ';
            answerRow.appendChild(answerLabel);

            const answerText = sheet[String.fromCharCode(66 + i) + row].v; // B = 66, C = 67, D = 68, ...
            const answerTextInput = document.createElement('input');
            answerTextInput.setAttribute('type', 'text');
            answerTextInput.setAttribute('value', answerText);
            answerTextInput.setAttribute('required', ''); // Thêm thuộc tính required
            answerRow.appendChild(answerTextInput);

            questionDiv.appendChild(answerRow);
            answerInputs.push(answerInput);
        }

        const correctAnswer = sheet['G' + row].v;
        answerInputs[correctAnswer - 1].setAttribute('checked', 'checked');

        questionContainer.appendChild(questionDiv);
    }

});