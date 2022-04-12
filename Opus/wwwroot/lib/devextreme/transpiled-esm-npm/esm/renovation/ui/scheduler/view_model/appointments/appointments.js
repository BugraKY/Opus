import _extends from "@babel/runtime/helpers/esm/extends";
import { AppointmentViewModelGenerator } from "../../../../../ui/scheduler/appointments/viewModelGenerator";
export var getAppointmentsViewModel = (model, filteredItems) => {
  var appointmentViewModel = new AppointmentViewModelGenerator();
  return appointmentViewModel.generate(filteredItems, _extends({}, model, {
    isRenovatedAppointments: true
  }));
};