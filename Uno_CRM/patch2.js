const fs = require('fs');
const file = 'c:/Ersen/Projects_2025/Uno_ERP/Uno_CRM/src/app/projects/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const financeTabStart = "{/* ──── FINANCE TAB ──── */}";
const existingFinanceTabTableStart = `<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">All Tour Services</h3>`;

const newFinancialPerformanceTable = `<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">Financial Performance by Tour</h3>
                <p className="text-sm text-slate-400">Monitor costs, revenues, and profit margins</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Tour Code</th>
                      <th className="px-6 py-3">Guide Name</th>
                      <th className="px-6 py-3">Dates</th>
                      <th className="px-6 py-3">Pax</th>
                      <th className="px-6 py-3">Days</th>
                      <th className="px-6 py-3">Total Cost</th>
                      <th className="px-6 py-3">Total Sales (Extra)</th>
                      <th className="px-6 py-3">Total Revenue</th>
                      <th className="px-6 py-3">Profit (+/-)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tours.map(tour => {
                      const tourServices = allServices.filter(s => s.tourId === tour.id);
                      const getClassification = (svc: any) => svc.serviceCategory?.classification || 'Standard';
                      const tourExtras = tourServices.filter(s => getClassification(s) === 'Extra');
                      
                      const cost = tourServices.reduce((sum, s) => sum + (s.totalAmount || (s.unitPrice * (s.quantity || 1) * (s.roomCount || 1)) || 0), 0);
                      const sales = tourExtras.reduce((sum, s) => sum + (s.totalAmount || (s.unitPrice * (s.quantity || 1) * (s.roomCount || 1)) || 0), 0);
                      const revenue = sales; // Flat model for now
                      const profit = revenue - cost;
                      
                      // Find guide name from services (any service with guideId)
                      const guideSvc = tourServices.find(s => s.guideId != null && s.guide);
                      const guideName = guideSvc?.guide?.name || '-';
                      
                      const startDate = new Date(tour.arrivalDate);
                      const endDate = new Date(tour.endDate);
                      const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));

                      return (
                        <tr key={tour.id} className="hover:bg-slate-50">
                          <td className="px-6 py-3"><a href={\`/projects/\${projectId}/tours/\${tour.id}\`} className="font-medium text-blue-600 hover:underline">{tour.tourCode}</a></td>
                          <td className="px-6 py-3 text-slate-600">{guideName}</td>
                          <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</td>
                          <td className="px-6 py-3 text-slate-600">{tour.pax}</td>
                          <td className="px-6 py-3 text-slate-600">{days}</td>
                          <td className="px-6 py-3 font-medium text-amber-600">€{cost.toLocaleString()}</td>
                          <td className="px-6 py-3 font-medium text-blue-600">€{sales.toLocaleString()}</td>
                          <td className="px-6 py-3 font-medium text-sky-600">€{revenue.toLocaleString()}</td>
                          <td className={\`px-6 py-3 font-bold \${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}\`}>
                            €{Math.abs(profit).toLocaleString()} {profit >= 0 ? '(+)' : '(-)'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            `;

content = content.replace(existingFinanceTabTableStart, newFinancialPerformanceTable + existingFinanceTabTableStart);
fs.writeFileSync(file, content);
console.log("Patched finance tab successfully!");
