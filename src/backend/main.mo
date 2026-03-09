import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";



actor {
  // DATA STRUCTURES
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

  module AppointmentRequest {
    public func compare(a : AppointmentRequest, b : AppointmentRequest) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // COMPONENT LOGIC

  // Persistent state variables
  stable var nextId = 1;
  stable let appointmentRequests = Map.empty<Nat, AppointmentRequest>();

  public shared ({ caller }) func submitAppointmentRequest(name : Text, phone : Text, email : Text, preferredDatetime : Text, reason : Text) : async Nat {
    let request : AppointmentRequest = {
      id = nextId;
      name;
      phone;
      email;
      preferredDatetime;
      reason;
      status = "pending";
      notes = "";
      timestamp = Time.now();
    };

    appointmentRequests.add(nextId, request);
    let currentId = nextId;
    nextId += 1;
    currentId;
  };

  public query ({ caller }) func getAllAppointmentRequests() : async [AppointmentRequest] {
    appointmentRequests.values().toArray().sort();
  };

  public query ({ caller }) func getAppointmentRequest(id : Nat) : async AppointmentRequest {
    switch (appointmentRequests.get(id)) {
      case (null) { Runtime.trap("No appointment request found with the given ID") };
      case (?request) { request };
    };
  };

  public shared ({ caller }) func updateAppointmentStatus(id : Nat, status : Text, notes : Text) : async Bool {
    switch (appointmentRequests.get(id)) {
      case (null) { false };
      case (?request) {
        let updatedRequest : AppointmentRequest = {
          request with status;
          notes;
        };
        appointmentRequests.add(id, updatedRequest);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteAppointmentRequest(id : Nat) : async Bool {
    if (appointmentRequests.containsKey(id)) {
      appointmentRequests.remove(id);
      true;
    } else {
      false;
    };
  };
};
