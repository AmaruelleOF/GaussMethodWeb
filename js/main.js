  const rowsSelect = document.getElementById("rows");
  const colsSelect = document.getElementById("cols");
  const table = document.getElementById("my-table");
  const resultsContainer = document.getElementById("results-container");
  const solveButton = document.getElementById("solve-btn");
  const stepsList = document.getElementById("steps-list");

  solveButton.addEventListener("click", solveMatrix);

  function solveMatrix() {
    stepsList.innerHTML = ""
    // Check that all inputs are filled
    const inputElements = Array.from(table.getElementsByTagName("input"));
    for (let i = 0; i < inputElements.length; i++) {
      if (!inputElements[i].value) {
        alert("Please fill in all input fields");
        return;
      }
    }
    const resultElements = Array.from(resultsContainer.getElementsByTagName("input"));
    for (let i = 0; i < resultElements.length; i++) {
      if (!resultElements[i].value) {
        alert("Please fill in all result fields");
        return;
      }
    }

    // Get the matrix values from the input elements
    const matrix = [];
    for (let i = 0; i < table.getElementsByTagName("mtr").length; i++) {
      const row = table.getElementsByTagName("mtr")[i];
      matrix.push([]);
      for (let j = 0; j < row.getElementsByTagName("mtd").length; j++) {
        const cell = row.getElementsByTagName("mtd")[j];
        const input = cell.getElementsByTagName("input")[0];
        matrix[i][j] = parseFloat(input.value);
      }
    }

    // Get the result values from the result elements
    const results = [];
    for (let i = 0; i < resultElements.length; i++) {
      results.push(parseFloat(resultElements[i].value));
    }

    // Add zero rows or columns as necessary to make matrix square
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    if (numRows < numCols) {
      for (let i = numRows; i < numCols; i++) {
        matrix.push(new Array(numCols).fill(0));
      }
    } else if (numCols < numRows) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = numCols; j < numRows; j++) {
          matrix[i][j] = 0;
        }
      }
    }

    // Perform Gaussian elimination
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
      // Find pivot row
      let maxRowIndex = i;
      let maxRowValue = Math.abs(matrix[i][i]);
      for (let j = i + 1; j < n; j++) {
        const rowValue = Math.abs(matrix[j][i]);
        if (rowValue > maxRowValue) {
          maxRowValue = rowValue;
          maxRowIndex = j;
        }
      }

      // Swap pivot row with current row if necessary
      if (maxRowIndex !== i) {
        [matrix[i], matrix[maxRowIndex]] = [matrix[maxRowIndex], matrix[i]];
        [results[i], results[maxRowIndex]] = [results[maxRowIndex], results[i]];
      }

      // Reduce current column
      for (let j = i + 1; j < n; j++) {
        const factor = matrix[j][i] / matrix[i][i];
        for (let k = i; k < n; k++) {
          matrix[j][k] -= factor * matrix[i][k];
        }
        results[j] -= factor * results[i];
      }

      // Add step to steps list
      const stepListElement = document.createElement("li");
      stepListElement.classList.add("list-group-item");
      const stepMatrix = matrix.map(row => row.map(value => value.toFixed(2)));
      const stepResults = results.map(value => value.toFixed(2));
      stepListElement.innerText = `Шаг ${i + 1}: ${stepMatrix} | ${stepResults}`;
      stepsList.appendChild(stepListElement);
    }

// Back-substitute to find solutions
    const solutions = new Array(numCols);
    for (let i = numCols - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += matrix[i][j] * solutions[j];
      }
      solutions[i] = (results[i] - sum) / matrix[i][i];
    }

// Add final step to steps list
    const finalStepListElement = document.createElement("li");
    finalStepListElement.innerText = `Ответ: ${solutions.map(value => value.toFixed(2))}`;
    finalStepListElement.classList.add("list-group-item");
    stepsList.appendChild(finalStepListElement);
  }
  
  colsSelect.addEventListener("change", updateTable);

  function updateTable() {
    // Get the new row and column count
    const newRow = parseInt(rowsSelect.value);
    const newCol = parseInt(colsSelect.value);
    // Get the existing input elements in the results container
    const existingInputElements = resultsContainer.getElementsByTagName("input");
    
    // Add or remove rows as necessary
    while (table.getElementsByTagName("mtr").length < newRow) {
      const newRowElement = document.createElement("mtr");
      for (let i = 0; i < newCol; i++) {
        const newCellElement = document.createElement("mtd");
        const newInputElement = document.createElement("input");
        newInputElement.type = "number";
        newInputElement.classList.add("form-control");
        newCellElement.appendChild(newInputElement);
        newRowElement.appendChild(newCellElement);
      }
      table.appendChild(newRowElement);
      
      // Add a new input element to the results container
      const newResultInputElement = document.createElement("input");
      newResultInputElement.type = "number";
      newResultInputElement.classList.add("form-control");
      resultsContainer.appendChild(newResultInputElement);
    }
    while (table.getElementsByTagName("mtr").length > newRow) {
      table.removeChild(table.lastChild);
      
      // Remove the last input element from the results container
      resultsContainer.removeChild(resultsContainer.lastChild);
    }

    // Add or remove columns as necessary
    for (let i = 0; i < table.getElementsByTagName("mtr").length; i++) {
      const row = table.getElementsByTagName("mtr")[i];
      while (row.getElementsByTagName("mtd").length < newCol) {
        const newCellElement = document.createElement("mtd");
        const newInputElement = document.createElement("input");
        newInputElement.type = "number";
        newInputElement.classList.add("form-control");
        newCellElement.appendChild(newInputElement);
        row.appendChild(newCellElement);
      }
      while (row.getElementsByTagName("mtd").length > newCol) {
        row.removeChild(row.lastChild);
      }
    }
    
    // Add or remove input elements in the results container as necessary
    while (existingInputElements.length < newRow) {
      const newResultInputElement = document.createElement("input");
      newResultInputElement.type = "number";
      newResultInputElement.classList.add("form-control");
      resultsContainer.appendChild(newResultInputElement);
    }
    while (existingInputElements.length > newRow) {
      resultsContainer.removeChild(resultsContainer.lastChild);
    }
  }

  // Listen for changes in the input elements
  table.addEventListener("input", handleInput);

  function handleInput(event) {
    const inputElement = event.target;
    const row = inputElement.closest("mtr");
    const col = inputElement.closest("mtd");
    const rowIndex = Array.from(table.getElementsByTagName("mtr")).indexOf(row);
    const colIndex = Array.from(row.getElementsByTagName("mtd")).indexOf(col);
    console.log(`Value entered at row ${rowIndex}, column ${colIndex}: ${inputElement.value}`);
  }