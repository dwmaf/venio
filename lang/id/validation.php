<?php

return [

  /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

  'required' => 'Kolom :attribute wajib diisi.',
  'required_if' => 'Kolom :attribute wajib diisi jika :other adalah :value.',
  // ... tambahkan terjemahan lainnya di sini jika perlu
  // Anda bisa menyalin dari vendor/laravel/framework/src/Illuminate/Translation/lang/en/validation.php

  /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

  'custom' => [
    'attribute-name' => [
      'rule-name' => 'custom-message',
    ],
  ],

  /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

  'attributes' => [
    'nama_event' => 'Nama Acara',
    'tipe_event' => 'Tipe Acara',
    'lokasi' => 'Lokasi',
    'tanggal_event' => 'Tanggal Acara',
    'jam_mulai' => 'Jam Mulai',
    'jam_selesai' => 'Jam Selesai',
    'quota' => 'Kuota Peserta',
  ],

];
