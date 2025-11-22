'use client';

import { useState } from 'react';

type DealItemType = 'food' | 'drink' | 'both';
type RestaurantType = 'local' | 'chain' | 'sponsored';

interface Deal {
  id: string;
  title: string;
  summary: string;
  description: string;
  type: DealItemType;
  price?: string;
  dayOfWeek?: number;
  daysOfWeek?: number[];
  startHour?: number;
  endHour?: number;
  lastVerified?: string;
  isActive: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  type: RestaurantType;
  deals: Deal[];
}

interface City {
  name: string;
  province: string;
  restaurants: Restaurant[];
}

interface DealsData {
  cities: { [slug: string]: City };
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatHour(hour: number): string {
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

export default function AdminHome() {
  const [data, setData] = useState<DealsData | null>(null);
  const [etag, setEtag] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  // Add new modals
  const [showAddCity, setShowAddCity] = useState(false);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCityProvince, setNewCityProvince] = useState('AB');
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newRestaurantType, setNewRestaurantType] = useState<RestaurantType>('local');

  const handleStart = async () => {
    setIsLoading(true);
    setStatus('Loading...');
    try {
      const response = await fetch('/api/deals');
      if (!response.ok) throw new Error('Failed to load');
      const json = await response.json();
      setData(json);
      setEtag(response.headers.get('ETag'));
      setHasChanges(false);
      setStatus('Loaded');
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setIsLoading(true);
    setStatus('Saving...');
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (etag) headers['If-Match'] = etag;
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (response.status === 409) {
        setStatus('Error: Data was modified elsewhere. Please reload.');
        return;
      }
      if (!response.ok) throw new Error('Failed to save');
      setEtag(response.headers.get('ETag'));
      setHasChanges(false);
      setStatus('Saved');
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (hasChanges && !confirm('Discard unsaved changes?')) return;
    setData(null);
    setEtag(null);
    setSelectedCity(null);
    setSelectedRestaurant(null);
    setHasChanges(false);
    setStatus('');
  };

  const updateData = (newData: DealsData) => {
    setData(newData);
    setHasChanges(true);
  };

  // City operations
  const addCity = () => {
    if (!data || !newCityName.trim()) return;
    const slug = generateId(newCityName);
    if (data.cities[slug]) {
      setStatus('Error: City exists');
      return;
    }
    updateData({
      ...data,
      cities: { ...data.cities, [slug]: { name: newCityName.trim(), province: newCityProvince, restaurants: [] } },
    });
    setShowAddCity(false);
    setNewCityName('');
    setSelectedCity(slug);
  };

  const deleteCity = (slug: string) => {
    if (!data) return;
    if (!confirm(`Delete "${data.cities[slug].name}" and all restaurants?`)) return;
    const { [slug]: _removed, ...rest } = data.cities;
    void _removed;
    updateData({ ...data, cities: rest });
    if (selectedCity === slug) {
      setSelectedCity(null);
      setSelectedRestaurant(null);
    }
  };

  // Restaurant operations
  const addRestaurant = () => {
    if (!data || !selectedCity || !newRestaurantName.trim()) return;
    const city = data.cities[selectedCity];
    const id = generateId(newRestaurantName);
    if (city.restaurants.some((r) => r.id === id)) {
      setStatus('Error: Restaurant exists');
      return;
    }
    updateData({
      ...data,
      cities: {
        ...data.cities,
        [selectedCity]: {
          ...city,
          restaurants: [...city.restaurants, { id, name: newRestaurantName.trim(), type: newRestaurantType, deals: [] }],
        },
      },
    });
    setShowAddRestaurant(false);
    setNewRestaurantName('');
    setSelectedRestaurant(id);
  };

  const deleteRestaurant = (id: string) => {
    if (!data || !selectedCity) return;
    const city = data.cities[selectedCity];
    const r = city.restaurants.find((r) => r.id === id);
    if (!r || !confirm(`Delete "${r.name}" and all deals?`)) return;
    updateData({
      ...data,
      cities: {
        ...data.cities,
        [selectedCity]: { ...city, restaurants: city.restaurants.filter((r) => r.id !== id) },
      },
    });
    if (selectedRestaurant === id) setSelectedRestaurant(null);
  };

  // Deal operations
  const addDeal = () => {
    if (!data || !selectedCity || !selectedRestaurant) return;
    const city = data.cities[selectedCity];
    const rIdx = city.restaurants.findIndex((r) => r.id === selectedRestaurant);
    if (rIdx === -1) return;
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: '',
      summary: '',
      description: '',
      type: 'food',
      isActive: true,
      lastVerified: new Date().toISOString().split('T')[0],
    };
    const newRestaurants = [...city.restaurants];
    newRestaurants[rIdx] = { ...newRestaurants[rIdx], deals: [...newRestaurants[rIdx].deals, newDeal] };
    updateData({
      ...data,
      cities: { ...data.cities, [selectedCity]: { ...city, restaurants: newRestaurants } },
    });
  };

  const updateDeal = (dealId: string, updates: Partial<Deal>) => {
    if (!data || !selectedCity || !selectedRestaurant) return;
    const city = data.cities[selectedCity];
    const rIdx = city.restaurants.findIndex((r) => r.id === selectedRestaurant);
    if (rIdx === -1) return;
    const dIdx = city.restaurants[rIdx].deals.findIndex((d) => d.id === dealId);
    if (dIdx === -1) return;
    const newRestaurants = [...city.restaurants];
    const newDeals = [...newRestaurants[rIdx].deals];
    newDeals[dIdx] = { ...newDeals[dIdx], ...updates, lastVerified: new Date().toISOString().split('T')[0] };
    newRestaurants[rIdx] = { ...newRestaurants[rIdx], deals: newDeals };
    updateData({
      ...data,
      cities: { ...data.cities, [selectedCity]: { ...city, restaurants: newRestaurants } },
    });
  };

  const deleteDeal = (dealId: string) => {
    if (!data || !selectedCity || !selectedRestaurant) return;
    const city = data.cities[selectedCity];
    const rIdx = city.restaurants.findIndex((r) => r.id === selectedRestaurant);
    if (rIdx === -1) return;
    const deal = city.restaurants[rIdx].deals.find((d) => d.id === dealId);
    if (!deal || !confirm(`Delete "${deal.title || 'this deal'}"?`)) return;
    const newRestaurants = [...city.restaurants];
    newRestaurants[rIdx] = { ...newRestaurants[rIdx], deals: newRestaurants[rIdx].deals.filter((d) => d.id !== dealId) };
    updateData({
      ...data,
      cities: { ...data.cities, [selectedCity]: { ...city, restaurants: newRestaurants } },
    });
  };

  const toggleDealDay = (dealId: string, day: number) => {
    if (!data || !selectedCity || !selectedRestaurant) return;
    const city = data.cities[selectedCity];
    const rIdx = city.restaurants.findIndex((r) => r.id === selectedRestaurant);
    if (rIdx === -1) return;
    const deal = city.restaurants[rIdx].deals.find((d) => d.id === dealId);
    if (!deal) return;

    const currentDays = deal.daysOfWeek || (deal.dayOfWeek !== undefined ? [deal.dayOfWeek] : []);
    let newDays: number[];
    if (currentDays.includes(day)) {
      newDays = currentDays.filter((d) => d !== day);
    } else {
      newDays = [...currentDays, day].sort();
    }

    if (newDays.length === 0) {
      updateDeal(dealId, { daysOfWeek: undefined, dayOfWeek: undefined });
    } else if (newDays.length === 1) {
      updateDeal(dealId, { dayOfWeek: newDays[0], daysOfWeek: undefined });
    } else {
      updateDeal(dealId, { daysOfWeek: newDays, dayOfWeek: undefined });
    }
  };

  const getDealDays = (deal: Deal): number[] => {
    if (deal.daysOfWeek && deal.daysOfWeek.length > 0) return deal.daysOfWeek;
    if (deal.dayOfWeek !== undefined) return [deal.dayOfWeek];
    return [];
  };

  const currentCity = selectedCity && data ? data.cities[selectedCity] : null;
  const currentRestaurant = currentCity?.restaurants.find((r) => r.id === selectedRestaurant);

  // Not loaded - show start button
  if (!data) {
    return (
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <h1>Daily Grub Admin</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Click Start to load deals data.</p>
        <button onClick={handleStart} disabled={isLoading} style={btnGreen}>
          {isLoading ? 'Loading...' : 'Start'}
        </button>
        {status && <p style={{ marginTop: '1rem', color: status.includes('Error') ? 'red' : 'green' }}>{status}</p>}
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Daily Grub Admin</span>
          {hasChanges && <span style={{ color: '#f59e0b', marginLeft: '1rem' }}>• Unsaved</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSave} disabled={isLoading || !hasChanges} style={hasChanges ? btnGreen : btnDisabled}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleClose} style={btnGray}>Close</button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <button onClick={() => { setSelectedCity(null); setSelectedRestaurant(null); }} style={selectedCity ? linkStyle : { fontWeight: 'bold' }}>
          Cities
        </button>
        {currentCity && (
          <>
            <span style={{ color: '#999' }}>›</span>
            <button onClick={() => setSelectedRestaurant(null)} style={selectedRestaurant ? linkStyle : { fontWeight: 'bold' }}>
              {currentCity.name}
            </button>
          </>
        )}
        {currentRestaurant && (
          <>
            <span style={{ color: '#999' }}>›</span>
            <span style={{ fontWeight: 'bold' }}>{currentRestaurant.name}</span>
          </>
        )}
      </div>

      {status && <p style={{ marginBottom: '1rem', padding: '0.5rem', background: status.includes('Error') ? '#fee' : '#efe', borderRadius: '4px' }}>{status}</p>}

      {/* Cities list */}
      {!selectedCity && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h2 style={{ margin: 0 }}>Cities</h2>
            <button onClick={() => setShowAddCity(true)} style={btnBlue}>+ Add City</button>
          </div>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            {Object.entries(data.cities).map(([slug, city]) => (
              <div key={slug} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setSelectedCity(slug)}>
                <div>
                  <strong>{city.name}</strong>, {city.province}
                  <span style={{ color: '#666', marginLeft: '1rem' }}>{city.restaurants.length} restaurants</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteCity(slug); }} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
            {Object.keys(data.cities).length === 0 && <p style={{ padding: '1rem', color: '#666' }}>No cities yet</p>}
          </div>
        </div>
      )}

      {/* Restaurants list */}
      {currentCity && !selectedRestaurant && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h2 style={{ margin: 0 }}>Restaurants in {currentCity.name}</h2>
            <button onClick={() => setShowAddRestaurant(true)} style={btnBlue}>+ Add Restaurant</button>
          </div>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            {currentCity.restaurants.map((r) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setSelectedRestaurant(r.id)}>
                <div>
                  <strong>{r.name}</strong>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', padding: '2px 6px', background: r.type === 'local' ? '#d1fae5' : '#f3f4f6', borderRadius: '4px' }}>{r.type}</span>
                  <span style={{ color: '#666', marginLeft: '1rem' }}>{r.deals.length} deals</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteRestaurant(r.id); }} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
            {currentCity.restaurants.length === 0 && <p style={{ padding: '1rem', color: '#666' }}>No restaurants yet</p>}
          </div>
        </div>
      )}

      {/* Deals editor */}
      {currentRestaurant && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h2 style={{ margin: 0 }}>Deals at {currentRestaurant.name}</h2>
            <button onClick={addDeal} style={btnBlue}>+ Add Deal</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentRestaurant.deals.map((deal) => (
              <div key={deal.id} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '1rem', background: deal.isActive ? '#fff' : '#f9f9f9' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={deal.title}
                    onChange={(e) => updateDeal(deal.id, { title: e.target.value })}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontWeight: 'bold' }}
                  />
                  <select value={deal.type} onChange={(e) => updateDeal(deal.id, { type: e.target.value as DealItemType })} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                    <option value="both">Both</option>
                  </select>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input type="checkbox" checked={deal.isActive} onChange={(e) => updateDeal(deal.id, { isActive: e.target.checked })} />
                    Active
                  </label>
                  <button onClick={() => deleteDeal(deal.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </div>

                <input
                  type="text"
                  placeholder="Summary (short description)"
                  value={deal.summary}
                  onChange={(e) => updateDeal(deal.id, { summary: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '0.5rem' }}
                />

                <textarea
                  placeholder="Full description (details, locations, etc.)"
                  value={deal.description}
                  onChange={(e) => updateDeal(deal.id, { description: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '0.5rem', resize: 'vertical' }}
                />

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Days:</span>
                    {DAYS.map((day, i) => {
                      const isOn = getDealDays(deal).includes(i);
                      return (
                        <button
                          key={i}
                          onClick={() => toggleDealDay(deal.id, i)}
                          style={{
                            width: '28px', height: '28px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: isOn ? 'bold' : 'normal',
                            background: isOn ? '#3b82f6' : '#e5e7eb', color: isOn ? 'white' : '#333'
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                    {getDealDays(deal).length === 0 && <span style={{ fontSize: '0.8rem', color: '#999' }}>none selected</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Hours:</span>
                    <select value={deal.startHour ?? ''} onChange={(e) => updateDeal(deal.id, { startHour: e.target.value ? parseInt(e.target.value) : undefined })} style={{ padding: '0.25rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}>
                      <option value="">All day</option>
                      {HOURS.map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
                    </select>
                    {deal.startHour !== undefined && (
                      <>
                        <span>-</span>
                        <select value={deal.endHour ?? ''} onChange={(e) => updateDeal(deal.id, { endHour: e.target.value ? parseInt(e.target.value) : undefined })} style={{ padding: '0.25rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}>
                          <option value="">Close</option>
                          {HOURS.map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
                        </select>
                      </>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Price (optional)"
                    value={deal.price || ''}
                    onChange={(e) => updateDeal(deal.id, { price: e.target.value || undefined })}
                    style={{ width: '120px', padding: '0.25rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            ))}
            {currentRestaurant.deals.length === 0 && (
              <p style={{ padding: '1rem', color: '#666', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px' }}>No deals yet. Click &quot;+ Add Deal&quot; to create one.</p>
            )}
          </div>
        </div>
      )}

      {/* Add city modal */}
      {showAddCity && (
        <Modal onClose={() => setShowAddCity(false)}>
          <h3>Add City</h3>
          <input type="text" placeholder="City name" value={newCityName} onChange={(e) => setNewCityName(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          <select value={newCityProvince} onChange={(e) => setNewCityProvince(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="SK">Saskatchewan</option>
            <option value="MB">Manitoba</option>
            <option value="ON">Ontario</option>
          </select>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowAddCity(false)} style={btnGray}>Cancel</button>
            <button onClick={addCity} disabled={!newCityName.trim()} style={newCityName.trim() ? btnGreen : btnDisabled}>Add</button>
          </div>
        </Modal>
      )}

      {/* Add restaurant modal */}
      {showAddRestaurant && (
        <Modal onClose={() => setShowAddRestaurant(false)}>
          <h3>Add Restaurant</h3>
          <input type="text" placeholder="Restaurant name" value={newRestaurantName} onChange={(e) => setNewRestaurantName(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          <select value={newRestaurantType} onChange={(e) => setNewRestaurantType(e.target.value as RestaurantType)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="local">Local</option>
            <option value="chain">Chain</option>
            <option value="sponsored">Sponsored</option>
          </select>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowAddRestaurant(false)} style={btnGray}>Cancel</button>
            <button onClick={addRestaurant} disabled={!newRestaurantName.trim()} style={newRestaurantName.trim() ? btnGreen : btnDisabled}>Add</button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', width: '350px', maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const btnGreen: React.CSSProperties = { padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const btnBlue: React.CSSProperties = { padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const btnGray: React.CSSProperties = { padding: '0.5rem 1rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const btnDisabled: React.CSSProperties = { padding: '0.5rem 1rem', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '4px', cursor: 'not-allowed' };
const linkStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' };
