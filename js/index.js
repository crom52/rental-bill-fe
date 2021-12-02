// A $( document ).ready() block.
$(document).ready(function () {
  attachEvent();
  setInputMask();
  resetForm();
});

const attachEvent = async () => {
  onChangeElec();
  onChangeWater();
  onChangeRentalPrice();
  onChangeOtherPrice();
  onCheckInternet();
  onChangeDropdown();
};

/**Event (S) */
const onChangeWater = async () => {
  $('#water-new-input').on('change', async function () {
    let newWaterVal = toNumber($('#water-new-input').val());
    let oldWaterVal = toNumber($('#water-old-value').val());
    let singlePrce = toNumber($('#water-price').val());

    if (', .'.includes(newWaterVal.toString())) {
      return alert('Vui lòng nhập số nguyên');
    }

    if (newWaterVal < oldWaterVal) {
      return alert('Số mới phải lớn hơn hoặc bằng số cũ');
    }
    let used = newWaterVal - oldWaterVal;
    $('#water-used').text(toNumber(used));
    $('#water-used').val(toNumber(used));
    $('#water-total-price').val(toNumber(singlePrce * used));
    await calculateTotal();
  });
};

const onChangeElec = async () => {
  $('#elec-new-input').on('change', async function () {
    let newWaterVal = toNumber($('#elec-new-input').val());
    let oldWaterVal = toNumber($('#elec-old-value').val());
    let singlePrce = toNumber($('#elec-price').val());

    if (', .'.includes(newWaterVal.toString())) {
      return alert('Vui lòng nhập số nguyên');
    }

    if (newWaterVal < oldWaterVal) {
      return alert('Số mới phải lớn hơn hoặc bằng số cũ');
    }
    let used = newWaterVal - oldWaterVal;
    $('#elec-used').text(toNumber(used));
    $('#elec-used').val(used);
    $('#elec-total-price').val(toNumber(singlePrce * used));
    await calculateTotal();
  });
};

const onChangeRentalPrice = async () => {
  $('#room-price-input').on('change', async function () {
    await calculateTotal();
  });
};
const onChangeOtherPrice = async () => {
  $('#other-input').on('change', async function () {
    await calculateTotal();
  });
};
const onCheckInternet = () => {
  $('#internet-checkbox').on('change', async function () {
    let isChecked = $('#internet-checkbox').prop('checked');
    if (isChecked) {
      await $('#internet-checkbox').val(50000);
      $('.internet').show();
    } else {
      await $('#internet-checkbox').val(0);
      $('.internet').hide();
    }
    calculateTotal();
  });
};

const onChangeDropdown = async () => {
  $('#room-no, #month, #year').on('change', async function () {
    $('#elec-new-value').val('');
    $('#water-new-value').val('');

    let year = $('#year').val();
    let month = $('#month').val();
    let roomId = $('#room-no').val();
    if (!year || !month || !roomId) return;

    let rs = await Api.getPrevBill(roomId, year, month);
    let bill = null;
    if (rs) bill = rs.data;
    console.log(bill);
    if (bill) {
      $('#elec-old-value').val(bill.newElecVal);
      $('#water-old-value').val(bill.newWaterVal);
    } else {
      $('#elec-old-value').val(0);
      $('#water-old-value').val(0);
    }
  });
};
/**Event (E) */

const toNumber = (string) => {
  return Number(string.toString().replaceAll(',', '').replaceAll('.', ''));
};

const calculateTotal = async () => {
  let totalElec = toNumber($('#elec-total-price').val());
  let totalWater = toNumber($('#water-total-price').val());
  let rentPrice = toNumber($('#room-price-input').val());
  let internet;
  if ($('.internet').is(':hidden')) {
    internet = 0;
  } else {
    internet = toNumber($('#internet-price-input').val());
  }
  let other = toNumber($('#other-input').val());
  let total = totalElec + totalWater + rentPrice + internet + other;
  $('#total').val(total);
};

const resetForm = () => {
  //Elec
  $('#elec-new-input').val(0);
  $('#elec-old-value').val(0);
  $('#elec-used').val(0);
  $('#elec-total-price').val(0);

  //Water
  $('#water-new-input').val(0);
  $('#water-old-value').val(0);
  $('#water-used').val(0);
  $('#water-total-price').val(0);

  //Room price
  $('#room-price-input').val(0);

  //Other
  $('#other-input').val(0);

  //Total
  $('#total').val(0);
};

function allowOnlyNumber(evt) {
  // Only ASCII character in that range allowed
  let ASCIICode = evt.which ? evt.which : evt.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
  return true;
}

Inputmask.extendAliases({
  numberInputMask: {
    radixPoint: '.',
    // prefix: "₱ ",
    groupSeparator: ',',
    alias: 'numeric',
    autoGroup: true,
    digits: 3,
    clearMaskOnLostFocus: false,
  },
});

const setInputMask = () => {
  //Elec
  $('#elec-new-input').inputmask('numberInputMask');
  $('#elec-old-value').inputmask('numberInputMask');
  $('#elec-used').inputmask('numberInputMask');
  $('#elec-price').inputmask('numberInputMask');
  $('#elec-total-price').inputmask('numberInputMask');

  //Water
  $('#water-new-input').inputmask('numberInputMask');
  $('#water-old-value').inputmask('numberInputMask');
  $('#water-used').inputmask('numberInputMask');
  $('#water-price').inputmask('numberInputMask');
  $('#water-total-price').inputmask('numberInputMask');

  //Room price
  $('#room-price-input').inputmask('numberInputMask');

  //Room price
  $('#internet-price-input').inputmask('numberInputMask');

  //Other
  $('#other-input').inputmask('numberInputMask');

  //Total
  $('#total').inputmask('numberInputMask');
};

const printBill = async () => {
  //Set the print button visibility to 'hidden'
  await $('#print-bill').hide();
  await $('#save').hide();
  //Print the page content
  window.print();
  await $('#save').show();
  await $('#print-bill').show();
};

const saveBill = async () => {
  let confirm = window.confirm('Bạn có muốn lưu ?');
  if (!confirm) return;
  let params = {
    roomId: $('#room-no').val(),
    period: $('#month').val(),
    newElecVal: $('#elec-val').val(),
    newWaterVal: $('#water-val').val(),
    rentPrice: $('#rental-price').val(),
  };
  console.log(params);
  let rs = await Api.saveBill(params);
  // alert('Lưu thành công');
};
