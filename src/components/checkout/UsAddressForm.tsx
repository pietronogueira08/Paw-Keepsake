'use client';

/**
 * UsAddressForm — US shipping address form with react-hook-form + zod validation.
 *
 * Validates all fields inline and calls onSubmit with fully typed address data.
 * Includes all 50 US states + DC as dropdown options.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

// Local type for the US shipping address form
export interface UsShippingAddress {
  fullName: string;
  streetAddress: string;
  apartmentSuite?: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}


// ─── Schema ───────────────────────────────────────────────────────────────────

const UsShippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  streetAddress: z.string().min(5, 'Street address is required'),
  apartmentSuite: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().length(2, 'Please select a valid US state'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Valid 5-digit US ZIP code required'),
  email: z.string().email('Valid email required for tracking updates'),
  phone: z.string().min(10, 'Valid US phone number required'),
});

type UsShippingAddressFormValues = z.infer<typeof UsShippingAddressSchema>;

// ─── State options ────────────────────────────────────────────────────────────

const US_STATES: { abbr: string; name: string }[] = [
  { abbr: 'AL', name: 'Alabama' },
  { abbr: 'AK', name: 'Alaska' },
  { abbr: 'AZ', name: 'Arizona' },
  { abbr: 'AR', name: 'Arkansas' },
  { abbr: 'CA', name: 'California' },
  { abbr: 'CO', name: 'Colorado' },
  { abbr: 'CT', name: 'Connecticut' },
  { abbr: 'DC', name: 'District of Columbia' },
  { abbr: 'DE', name: 'Delaware' },
  { abbr: 'FL', name: 'Florida' },
  { abbr: 'GA', name: 'Georgia' },
  { abbr: 'HI', name: 'Hawaii' },
  { abbr: 'ID', name: 'Idaho' },
  { abbr: 'IL', name: 'Illinois' },
  { abbr: 'IN', name: 'Indiana' },
  { abbr: 'IA', name: 'Iowa' },
  { abbr: 'KS', name: 'Kansas' },
  { abbr: 'KY', name: 'Kentucky' },
  { abbr: 'LA', name: 'Louisiana' },
  { abbr: 'ME', name: 'Maine' },
  { abbr: 'MD', name: 'Maryland' },
  { abbr: 'MA', name: 'Massachusetts' },
  { abbr: 'MI', name: 'Michigan' },
  { abbr: 'MN', name: 'Minnesota' },
  { abbr: 'MS', name: 'Mississippi' },
  { abbr: 'MO', name: 'Missouri' },
  { abbr: 'MT', name: 'Montana' },
  { abbr: 'NE', name: 'Nebraska' },
  { abbr: 'NV', name: 'Nevada' },
  { abbr: 'NH', name: 'New Hampshire' },
  { abbr: 'NJ', name: 'New Jersey' },
  { abbr: 'NM', name: 'New Mexico' },
  { abbr: 'NY', name: 'New York' },
  { abbr: 'NC', name: 'North Carolina' },
  { abbr: 'ND', name: 'North Dakota' },
  { abbr: 'OH', name: 'Ohio' },
  { abbr: 'OK', name: 'Oklahoma' },
  { abbr: 'OR', name: 'Oregon' },
  { abbr: 'PA', name: 'Pennsylvania' },
  { abbr: 'RI', name: 'Rhode Island' },
  { abbr: 'SC', name: 'South Carolina' },
  { abbr: 'SD', name: 'South Dakota' },
  { abbr: 'TN', name: 'Tennessee' },
  { abbr: 'TX', name: 'Texas' },
  { abbr: 'UT', name: 'Utah' },
  { abbr: 'VT', name: 'Vermont' },
  { abbr: 'VA', name: 'Virginia' },
  { abbr: 'WA', name: 'Washington' },
  { abbr: 'WV', name: 'West Virginia' },
  { abbr: 'WI', name: 'Wisconsin' },
  { abbr: 'WY', name: 'Wyoming' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface UsAddressFormProps {
  onSubmit: (data: UsShippingAddress) => void | Promise<void>;
  defaultValues?: Partial<UsShippingAddressFormValues>;
  isSubmitting?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UsAddressForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: UsAddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsShippingAddressFormValues>({
    resolver: zodResolver(UsShippingAddressSchema),
    defaultValues: {
      fullName: '',
      streetAddress: '',
      apartmentSuite: '',
      city: '',
      state: '',
      zipCode: '',
      email: '',
      phone: '',
      ...defaultValues,
    },
  });

  function handleFormSubmit(values: UsShippingAddressFormValues) {
    const address: UsShippingAddress = {
      ...values,
      apartmentSuite: values.apartmentSuite || undefined,
    };
    return onSubmit(address);
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-4"
      aria-label="Shipping address"
    >
      {/* Full Name */}
      <Input
        label="Full Name"
        placeholder="Jane Smith"
        autoComplete="name"
        required
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      {/* Street Address */}
      <Input
        label="Street Address"
        placeholder="123 Maple Street"
        autoComplete="address-line1"
        required
        error={errors.streetAddress?.message}
        {...register('streetAddress')}
      />

      {/* Apt / Suite (optional) */}
      <Input
        label="Apartment / Suite"
        placeholder="Apt 4B (optional)"
        autoComplete="address-line2"
        error={errors.apartmentSuite?.message}
        {...register('apartmentSuite')}
      />

      {/* City + State + ZIP in a responsive grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* City */}
        <div className="col-span-2 sm:col-span-1">
          <Input
            label="City"
            placeholder="Chicago"
            autoComplete="address-level2"
            required
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        {/* State dropdown */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="state-select"
            className="text-sm font-medium text-foreground font-jakarta"
          >
            State <span className="text-accent" aria-hidden="true">*</span>
          </label>
          <select
            id="state-select"
            autoComplete="address-level1"
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? 'state-error' : undefined}
            className={cn(
              'w-full rounded-lg border bg-surface px-3.5 py-2.5',
              'text-sm text-foreground font-jakarta',
              'outline-none ring-0 transition-colors duration-150',
              'border-border focus:border-accent focus:ring-2 focus:ring-accent/20',
              errors.state && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            )}
            {...register('state')}
          >
            <option value="">State</option>
            {US_STATES.map(({ abbr, name }) => (
              <option key={abbr} value={abbr}>
                {abbr} — {name}
              </option>
            ))}
          </select>
          {errors.state && (
            <p id="state-error" role="alert" className="text-xs text-red-500 font-jakarta">
              {errors.state.message}
            </p>
          )}
        </div>

        {/* ZIP Code */}
        <Input
          label="ZIP Code"
          placeholder="60601"
          autoComplete="postal-code"
          inputMode="numeric"
          required
          error={errors.zipCode?.message}
          {...register('zipCode')}
        />
      </div>

      {/* Email */}
      <Input
        label="Email Address"
        type="email"
        placeholder="jane@example.com"
        autoComplete="email"
        required
        hint="We'll send your tracking number here."
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Phone */}
      <Input
        label="Phone Number"
        type="tel"
        placeholder="(312) 555-0100"
        autoComplete="tel"
        inputMode="tel"
        required
        hint="Only used if there's a delivery question."
        error={errors.phone?.message}
        {...register('phone')}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full rounded-full bg-accent py-3.5 text-sm font-bold text-white font-jakarta',
          'tracking-wide transition-colors shadow-lg shadow-accent/20',
          'hover:bg-accent-hover',
          'disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        {isSubmitting ? 'Saving…' : 'Continue to Payment →'}
      </button>
    </form>
  );
}