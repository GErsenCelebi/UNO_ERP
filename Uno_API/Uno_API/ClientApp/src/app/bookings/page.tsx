"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, Mail, Phone, Calendar, MapPin, Users, Loader2 } from "lucide-react";

const mockBookings = [
  { id: "BK-101", paxName: "John Doe", tourCode: "TR-001", destination: "Istanbul", status: "Confirmed", total: "€2,500", paid: "€2,500", date: "Oct 12, 2025" },
  { id: "BK-102", paxName: "Sarah Smith", tourCode: "TR-002", destination: "Cappadocia", status: "Deposit Paid", total: "€2,500", paid: "€500", date: "Oct 15, 2025" },
  { id: "BK-103", paxName: "Michael Johnson", tourCode: "TR-001", destination: "Istanbul", status: "Pending", total: "€2,500", paid: "€0", date: "Oct 18, 2025" },
  { id: "BK-104", paxName: "Emily Davis", tourCode: "TR-003", destination: "Antalya", status: "Confirmed", total: "€2,500", paid: "€2,500", date: "Oct 20, 2025" },
];

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockBookings.filter(b =>
    b.paxName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tourCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
        <div className="relative w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings by ID, name, or tour..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          />
        </div>
        <button className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5">
          <Plus className="w-5 h-5 mr-2" /> New Booking
        </button>
      </header>

      <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Booking &amp; Sales Tracking</h1>
            <p className="text-slate-500 text-sm mt-1">Manage passenger reservations and payments linked to tours</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Passenger</th>
                    <th className="px-6 py-4">Tour</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Paid</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(booking => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-blue-600">{booking.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{booking.paxName}</div>
                        <div className="flex gap-2 mt-1 text-slate-400">
                          <Mail className="w-3 h-3 cursor-pointer hover:text-blue-500" />
                          <Phone className="w-3 h-3 cursor-pointer hover:text-green-500" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{booking.tourCode}</span>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center"><MapPin className="w-3 h-3 mr-1" />{booking.destination}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" /> {booking.date}
                      </td>
                      <td className="px-6 py-4 font-medium">{booking.total}</td>
                      <td className="px-6 py-4 text-slate-600">{booking.paid}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          booking.status === 'Deposit Paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-500 hover:text-blue-600 font-medium text-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
