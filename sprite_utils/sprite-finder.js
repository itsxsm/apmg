const img = document.getElementById('image-1');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});

// img.addEventListener('load', () => {
  
// });
// const hoveredColor = document.getElementById('hovered-color');
// const selectedColor = document.getElementById('selected-color');


// function pick(event, destination) {
//   const bounding = canvas.getBoundingClientRect();
//   const x = event.clientX - bounding.left;
//   const y = event.clientY - bounding.top;
//   const pixel = ctx.getImageData(x, y, 1, 1);
//   const data = pixel.data;

//   const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
//   destination.style.background = rgba;
//   destination.textContent = rgba;

//   return rgba;
// }

const bounding = canvas.getBoundingClientRect();
let b_width = bounding.width;
let b_height = bounding.height;

function getPixel(i, j) {
  // reading pixels ould be made much more inefficient,
  // using getImageData with larger ranges than 1:1, but: meh
  return ctx.getImageData(i, j, 1, 1).data;
}

function runSpriteFinder() {
  ctx.drawImage(img, 0, 0);

  // step 1: find which rows have non-empty pixels

  const first_i_at_j = [];
  const last_i_at_j = [];
  for (var j = 0; j < b_height; j++) {
    for (var i = 0; i < b_width; i++) {
      if (getPixel(i, j)[3] !== 0) {
          first_i_at_j.push(i);
          break;
      }
    }
    if (first_i_at_j.length < (j + 1)) {
      first_i_at_j.push(-1);
      last_i_at_j.push(-1);
    } else {
      for (var i = b_width - 1; i >= first_i_at_j[j]; i--) {
        if (getPixel(i, j)[3] !== 0) {
          last_i_at_j.push(i);
          break;
        }
      }
    }
  }

  const row_bounds = [];
  for (var j = 0; j < b_height; j++) {
    row_bounds.push([first_i_at_j[j], last_i_at_j[j]]);
  }

  // step 2: group present rows into row blocks

  var row_blocks = [];
  var block_first_j = 0;
  var is_prior_row_present = false;
  if (first_i_at_j[0] != -1) {
    is_prior_row_present = true;
    block_first_j = 0;
  }
  for (var j = 0; j < b_height; j++) {
    var is_this_row_present = (first_i_at_j[j] != -1);
    if (is_prior_row_present != is_this_row_present) {
      if (is_this_row_present) {
        block_first_j = j;
      } else {
        row_blocks.push([block_first_j, j]);
      }
    }
    is_prior_row_present = is_this_row_present;
  }
  if (is_prior_row_present) {
    row_blocks.push([block_first_j, b_height - 1]);
  }

  // step 3: within each row block, group column blocks
  // by repeating steps 1 and 2 over j within the block

  var col_bounds_by_row_block = [];

  row_blocks.forEach(row_block => {
    var block_first_j = row_block[0];
    var block_last_j = row_block[1];

    var first_j_at_i = [];
    var last_j_at_i = [];
    var found;
    for (var i = 0; i < b_width; i++) {
      found = false;
      for (var j = block_first_j; j <= block_last_j && !found; j++) {
        if (getPixel(i, j)[3] !== 0) {
            first_j_at_i.push(j);
            found = true;
        }
      }
      if (!found) {
        first_j_at_i.push(-1);
        last_j_at_i.push(-1);
      } else {
        for (var j = block_last_j; j >= block_first_j; j--) {
          if (getPixel(i, j)[3] !== 0) {
            last_j_at_i.push(i);
            break;
          }
        }
      }
    }

    const col_bounds = [];
    for (var i = 0; i < b_width; i++) {
      col_bounds.push([first_j_at_i[i], last_j_at_i[i]]);
    }
    col_bounds_by_row_block.push(col_bounds);
  });

  console.log(JSON.stringify(col_bounds_by_row_block));
}

runSpriteFinder();

