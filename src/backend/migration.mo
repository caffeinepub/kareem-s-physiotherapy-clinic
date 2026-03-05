import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type AppointmentRequest = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    preferredDatetime : Text;
    reason : Text;
    status : Text;
    notes : Text;
    timestamp : Time.Time;
  };

  type OldActor = {
    var nextId : Nat;
    appointmentRequests : Map.Map<Nat, AppointmentRequest>;
  };

  // Only persistent variables are now persisted.
  public func run(old : OldActor) : { appointmentRequests : Map.Map<Nat, AppointmentRequest> } {
    { appointmentRequests = old.appointmentRequests };
  };
};
