import { SearchedMenuItem } from '@/api/interface/menuIterface'
import { searchMenu } from '@/api/order'
import useDebounce from '@/customHooks/useDebounce'
import React, { useState, useEffect, useRef } from 'react'
import './InputStyle.css'

const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchedMenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<SearchedMenuItem[]>([])
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [menuData, setMenuData] = useState<SearchedMenuItem[]>([])
  // MenuDataType
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Use the debounce hook to delay the search execution
  const debouncedSearchTerm = useDebounce(searchTerm, 300) // 300ms delay

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Function to handle selecting an item from dropdown
  const handleSelectItem = (item: SearchedMenuItem) => {
    // Prevent adding duplicates
    if (!selectedItems.find(selected => selected.id === item.id)) {
      setSelectedItems(prev => [...prev, item])
    }
    // Clear search
    setSearchTerm('')
    setSearchResults([])
    setShowDropdown(false)
  }

  useEffect(() => {
    const searchMenuItems = async () => {
      if (debouncedSearchTerm.trim() === '') {
        setSearchResults([])
        setShowDropdown(false)
        return
      }
      try {
        const params = debouncedSearchTerm.toLowerCase()
        // console.log(params, 'params')

        const response = await searchMenu(params)
        setMenuData(response?.data?.results)
        console.log(response?.data?.results, 'response')
      } catch (err: any) {
        console.error('Error fetching businesses:', err)
        // toast.error(err.message || 'Failed to fetch businesses')
      }
      const results = menuData.filter(item => item.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      setSearchResults(results)
      setShowDropdown(true)
    }

    searchMenuItems()
  }, [debouncedSearchTerm])

  // Function to handle removing an item from the table
  const handleRemoveItem = (id: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className='container'>
      <div className='searchContainer' ref={dropdownRef}>
        <input
          type='text'
          value={searchTerm}
          placeholder='Search menu items'
          className='input'
          onChange={e => setSearchTerm(e.target.value)}
        />

        {showDropdown && searchResults.length > 0 && (
          <ul className='dropdown'>
            {searchResults.map(item => (
              <li key={item.id} className='dropdownItem' onClick={() => handleSelectItem(item)}>
                <strong>{item.sku}</strong>: {item.sku}
              </li>
            ))}
          </ul>
        )}
        {showDropdown && searchResults.length === 0 && (
          <ul className='dropdown'>
            <li className='noResults'>No results found.</li>
          </ul>
        )}
      </div>

      {selectedItems.length > 0 && (
        <table className='table'>
          <thead>
            <tr>
              <th className='theading'>ID</th>
              <th className='theading'>SKU</th>
              <th className='theading'>TITLE</th>
              <th className='theading'>PRICE</th>
              <th className='theading'>QTY</th>
              <th className='theading'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map(item => (
              <tr key={item.id}>
                <td className='tdata'>{item.id}</td>
                <td className='tdata'>{item.sku}</td>
                <td className='tdata'>{item.title}</td>
                <td className='tdata'>{item.price}</td>
                <td className='tdata'>{item.quantity_to_sell_on_facebook}</td>
                <td className='tdata'>
                  <button onClick={() => handleRemoveItem(item.id)} className='removeButton'>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default SearchComponent
