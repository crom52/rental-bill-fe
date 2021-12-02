$(document).ready(function () {
  attachEvent();
});

const attachEvent = () => {
  onChangeDropdown(); //month, year
};

const onChangeDropdown = async () => {
  $('#room-no, #month , #year').on('change', async function () {
    $('#new-elec-val').val('');
    $('#new-water-val').val('');
    let year = $('#year').val();
    let month = $('#month').val();
    let roomId = $('#room-no').val();
    if (!year || !month || !roomId) return;
    let rs = await Api.getPrevBill(roomId, year, month);
    let bill = null;
    if (rs) bill = rs.data;
    if (bill) {
      $('#old-elec-val').text(bill.newElecVal || '');
      $('#old-water-val').text(bill.newWaterVal || '');
    } else {
      $('#old-elec-val').val('');
      $('#old-water-val').val('');
      $('#old-elec-val').text('');
      $('#old-water-val').text('');
    }
  });
};
const saveBill = async () => {
  let roomId = $('#room-no').val();
  let year = $('#year').val();
  let month = $('#month').val();
  if (!roomId || !year || !month)
    return alert('Vui lòng chọn phòng , tháng, năm');
  let confirm = window.confirm('Bạn có muốn lưu ?');
  if (!confirm) return;
  let params = {
    roomId: roomId,
    year: year,
    month: month,
    newElecVal: $('#new-elec-val').val(),
    newWaterVal: $('#new-water-val').val(),
    rentalPrice: $('#rental-price').val(),
  };
  let rs = await Api.saveBill(params);
  if (rs && rs.status == 200) {
    alert('Lưu thành công');
  }
};
