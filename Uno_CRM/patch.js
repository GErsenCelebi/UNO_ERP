const fs = require('fs');
const file = 'c:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/src/app/projects/[id]/tours/[tourId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update services tab layout
// We will replace the entire Services Tab block to reorder and add "Other Services"
// and update the Total area to show Revenue/Cost/Profit.

const servicesTabStartStr = "{/* ──── SERVICES TAB ──── */}\n        {activeTab === 'services' && (\n          <div className=\"p-6 space-y-6 max-w-6xl mx-auto\">";
const servicesTotalEndStr = "</div>\n          </div>\n        )}";

const oldServicesTabIdx = content.indexOf(servicesTabStartStr);
const oldServicesTotalEndIdx = content.indexOf(servicesTotalEndStr, oldServicesTabIdx) + servicesTotalEndStr.length;

const newServicesTabStr = `{/* ──── SERVICES TAB ──── */}
        {activeTab === 'services' && (
          <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Extra Services */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Extra Services</h3>
                  <p className="text-sm text-slate-400">Excursions, add-ons, and extras (Sales)</p>
                </div>
                <div className="flex gap-2">
                  {serviceCategories.filter(c => c.classification === 'Extra').map(cat => (
                    <button key={cat.id} onClick={() => openServiceModal(cat.name)} className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-lg text-xs font-medium transition-colors gap-1">
                      <Plus className="w-3 h-3" /> {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Unit Price</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {extraServices.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No extra services yet.</td></tr>
                    ) : extraServices.map(svc => (
                      <tr key={svc.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">{getCategoryName(svc)}</span></td>
                        <td className="px-6 py-3 font-medium text-slate-700">{svc.description || '-'}</td>
                        <td className="px-6 py-3">{svc.quantity}</td>
                        <td className="px-6 py-3">€{Number(svc.unitPrice).toFixed(2)}</td>
                        <td className="px-6 py-3 font-semibold text-slate-800">€{Number(svc.totalAmount || svc.unitPrice * svc.quantity).toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => openEditServiceModal(svc)} className="text-slate-400 hover:text-blue-500 transition-colors mr-2"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteService(svc.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Other Services */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Other Services</h3>
                  <p className="text-sm text-slate-400">Miscellaneous services</p>
                </div>
                <div className="flex gap-2">
                  {serviceCategories.filter(c => c.classification === 'Other').map(cat => (
                    <button key={cat.id} onClick={() => openServiceModal(cat.name)} className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-600 rounded-lg text-xs font-medium transition-colors gap-1">
                      <Plus className="w-3 h-3" /> {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Unit Price</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {otherServices.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No other services yet.</td></tr>
                    ) : otherServices.map(svc => (
                      <tr key={svc.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3"><span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs font-medium">{getCategoryName(svc)}</span></td>
                        <td className="px-6 py-3 font-medium text-slate-700">{svc.description || '-'}</td>
                        <td className="px-6 py-3">{svc.quantity}</td>
                        <td className="px-6 py-3">€{Number(svc.unitPrice).toFixed(2)}</td>
                        <td className="px-6 py-3 font-semibold text-slate-800">€{Number(svc.totalAmount || svc.unitPrice * svc.quantity).toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => openEditServiceModal(svc)} className="text-slate-400 hover:text-blue-500 transition-colors mr-2"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteService(svc.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Standard Services */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Standard Services</h3>
                  <p className="text-sm text-slate-400">Core operational services</p>
                </div>
                <div className="flex gap-2">
                  {serviceCategories.filter(c => c.classification === 'Standard').map(cat => (
                    <button key={cat.id} onClick={() => openServiceModal(cat.name)} className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-xs font-medium transition-colors gap-1">
                      <Plus className="w-3 h-3" /> {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Room/Details</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Unit Price</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {standardServices.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No standard services yet.</td></tr>
                    ) : standardServices.map(svc => (
                      <tr key={svc.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{getCategoryName(svc)}</span></td>
                        <td className="px-6 py-3 font-medium text-slate-700">{svc.description || '-'}</td>
                        <td className="px-6 py-3 text-slate-500">{svc.roomType ? \`\${svc.roomType} ×\${svc.roomCount || 1}\` : (svc.flightNo ? \`\${svc.flightNo} \${svc.fromAirport || ''}-\${svc.toAirport || ''}\` : '-')}</td>
                        <td className="px-6 py-3 text-slate-500">{svc.quantity}</td>
                        <td className="px-6 py-3">€{Number(svc.unitPrice).toFixed(2)}</td>
                        <td className="px-6 py-3 font-semibold text-slate-800">€{Number(svc.totalAmount || svc.unitPrice * svc.quantity * (svc.roomCount || 1)).toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => openEditServiceModal(svc)} className="text-slate-400 hover:text-blue-500 transition-colors mr-2"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteService(svc.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-2xl p-6 text-white flex flex-col justify-center">
                <p className="text-slate-400 text-sm font-medium">Total Revenue (Sales)</p>
                <h3 className="text-2xl font-bold mt-1">€{totalSales.toLocaleString()}</h3>
              </div>
              <div className="bg-slate-100 rounded-2xl p-6 text-slate-800 flex flex-col justify-center border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Total Service Cost</p>
                <h3 className="text-2xl font-bold mt-1">€{totalServiceCost.toLocaleString()}</h3>
              </div>
              <div className={\`col-span-2 rounded-2xl p-6 flex flex-col justify-center text-white \${profit >= 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}\`}>
                <p className="text-white/80 text-sm font-medium">Profit</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-4xl font-bold mt-1">€{Math.abs(profit).toLocaleString()} {profit >= 0 ? '(+)' : '(-)'}</h3>
                  <div className="text-right">
                    <p className="text-white/90 text-sm">{services.length} services total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}`;

content = content.substring(0, oldServicesTabIdx) + newServicesTabStr + content.substring(oldServicesTotalEndIdx);

// 2. Update Hotel Modal Inputs
const oldHotelInputsStr = `{/* Hotel */}
              {serviceType === 'Hotel' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Hotel</label>
                    <select required value={newService.hotelId || ''} onChange={e => {
                      const h = hotels.find((x: any) => x.id === parseInt(e.target.value));
                      setNewService({ ...newService, hotelId: h?.id || null, description: h?.name || '', unitPrice: h?.nightlyRate || 0 });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">Select a Hotel...</option>
                      {hotels.map((h: any) => <option key={h.id} value={h.id}>{h.name} — {h.location} (€{h.nightlyRate}/night)</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Type</label>
                      <select value={newService.roomType} onChange={e => setNewService({ ...newService, roomType: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                        {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Rooms</label>
                      <input required type="number" min="1" value={newService.roomCount} onChange={e => setNewService({ ...newService, roomCount: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nights</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Rate/Night (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  {newService.unitPrice > 0 && newService.roomCount > 0 && (
                    <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700 font-medium">
                      Total: {newService.quantity} nights × €{newService.unitPrice} × {newService.roomCount} rooms = <strong>€{(newService.quantity * newService.unitPrice * newService.roomCount).toLocaleString()}</strong>
                    </div>
                  )}
                </>
              )}`;

const newHotelInputsStr = `{/* Hotel */}
              {serviceType === 'Hotel' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Hotel</label>
                    <select required value={newService.hotelId || ''} onChange={e => {
                      const h = hotels.find((x: any) => x.id === parseInt(e.target.value));
                      setNewService({ ...newService, hotelId: h?.id || null, description: h?.name || '', unitPrice: h?.doubleRate || 0 });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">Select a Hotel...</option>
                      {hotels.map((h: any) => <option key={h.id} value={h.id}>{h.name} — {h.location}</option>)}
                    </select>
                  </div>
                  
                  {!editingServiceId ? (
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Single</label>
                        <input type="number" min="0" value={newService.singleCount} onChange={e => setNewService({ ...newService, singleCount: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Double</label>
                        <input type="number" min="0" value={newService.doubleCount} onChange={e => setNewService({ ...newService, doubleCount: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Twin</label>
                        <input type="number" min="0" value={newService.twinCount} onChange={e => setNewService({ ...newService, twinCount: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Triple</label>
                        <input type="number" min="0" value={newService.tripleCount} onChange={e => setNewService({ ...newService, tripleCount: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Type</label>
                        <select value={newService.roomType} onChange={e => setNewService({ ...newService, roomType: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                          {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Rooms</label>
                        <input required type="number" min="1" value={newService.roomCount} onChange={e => setNewService({ ...newService, roomCount: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nights</label>
                    <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </>
              )}`;

content = content.replace(oldHotelInputsStr, newHotelInputsStr);

// 3. Update Flight Inputs
const oldFlightInputsStr = `{/* Flight */}
              {serviceType === 'Flight' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <input required type="text" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Return flight IST-BUD" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tickets (Qty)</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Price per Ticket (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </>
              )}`;

const newFlightInputsStr = `{/* Flight */}
              {serviceType === 'Flight' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (Passenger Names, etc)</label>
                    <input required type="text" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Flight for Group A" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Flight No</label>
                      <input required type="text" value={newService.flightNo} onChange={e => setNewService({ ...newService, flightNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="TK 1234" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Flight Date</label>
                      <input required type="date" value={newService.serviceDate} onChange={e => setNewService({ ...newService, serviceDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">From Airport</label>
                      <input required type="text" value={newService.fromAirport} onChange={e => setNewService({ ...newService, fromAirport: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="IST" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">To Airport</label>
                      <input required type="text" value={newService.toAirport} onChange={e => setNewService({ ...newService, toAirport: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="BUD" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tickets (Qty)</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Price per Ticket (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </>
              )}`;

content = content.replace(oldFlightInputsStr, newFlightInputsStr);

fs.writeFileSync(file, content);
console.log("Patched page.tsx successfully!");
