const img = document.getElementById('image-1');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});

const bounding = canvas.getBoundingClientRect();
let b_width = bounding.width;
let b_height = bounding.height;

function getPixel(i, j) {
  // reading pixels could be made much more inefficient,
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
  var is_prior_row_present = (first_i_at_j[0] != -1);
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
  var col_blocks_by_row_block = [];

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

    var col_blocks = [];
    var block_first_i = 0;
    var is_prior_col_present = (first_j_at_i[0] != -1);
    for (var i = 0; i < b_width; i++) {
      var is_this_col_present = (first_j_at_i[i] != -1);
      if (is_prior_col_present != is_this_col_present) {
        if (is_this_col_present) {
          block_first_i = i;
        } else {
          col_blocks.push([block_first_i, i]);
        }
      }
      is_prior_col_present = is_this_col_present;
    }
    if (is_prior_col_present) {
      col_blocks.push([block_first_i, b_width - 1]);
    }

    col_blocks_by_row_block.push(col_blocks);
  });

  // step 4: we now have a box for every sprite,
  // but the j range of all sprites is the same within a row.
  // Pull in each sprite to its real j range.

  const sprite_boxes = [];
  row_blocks.forEach((row_block, row_block_idx) => {
    const min_j = row_block[0];
    const max_j = row_block[1];
    col_blocks_by_row_block[row_block_idx].forEach(col_block => {
      const min_i = col_block[0];
      const max_i = col_block[1];
      const sprite_box = {
        iRange: [min_i, max_i],
        jRange: [undefined, undefined]
      };

      var found = false;
      for (var j = min_j; j <= max_j && !found; j++) {
        for (var i = min_i; i <= max_i && !found; i++) {
          if (getPixel(i, j)[3] !== 0) {
            sprite_box.jRange[0] = j;
            found = true;
          }
        }
      }

      found = false;
      for (var j = max_j; j >= min_j && !found; j--) {
        for (var i = min_i; i <= max_i && !found; i++) {
          if (getPixel(i, j)[3] !== 0) {
            sprite_box.jRange[1] = j;
            found = true;
          }
        }
      }

      sprite_boxes.push(sprite_box);
    })
  });

  sprite_boxes.forEach(sprite_box => {
    console.log(JSON.stringify(sprite_box));
  });
}

runSpriteFinder();

