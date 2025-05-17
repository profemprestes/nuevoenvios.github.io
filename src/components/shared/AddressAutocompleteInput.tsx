
"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { addressAutocompletion, type AddressAutocompletionInput } from '@/ai/flows/address-autocompletion';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddressAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

// Basic debounce function
const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise(resolve => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(func(...args));
      }, delay);
    });
  };
};


export default function AddressAutocompleteInput({
  value,
  onChange,
  placeholder = "Escriba una dirección...",
  id,
}: AddressAutocompleteInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchSuggestions = useCallback(async (partialAddress: string) => {
    if (partialAddress.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      const input: AddressAutocompletionInput = { partialAddress };
      const result = await addressAutocompletion(input);
      setSuggestions(result.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), [fetchSuggestions]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue); // Update form state immediately for uncontrolled behavior if needed
    debouncedFetchSuggestions(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion); // This updates the react-hook-form field
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click event to fire
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="relative w-full">
      <Input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => inputValue && suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="pr-10"
        autoComplete="off"
      />
      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ScrollArea className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer truncate px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                onMouseDown={() => handleSuggestionClick(suggestion)} // Use onMouseDown to fire before blur
                title={suggestion}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}

