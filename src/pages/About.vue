<template>
  
<div class="container py-5">
    <h2 class="mb-4 text-center">📓 Changelog</h2>

    <p class="text-center mb-4">If you find any bugs, or have any suggestions, please send us a email at <a href="mailto:hi@trak.tools">hi@trak.tools</a>.</p>
    <p class="text-center mb-4">Last updated: <strong>June 16, 2025</strong></p>
    <p class="text-center mb-4">Version: DEV <strong>0.2.1</strong></p>



    <!-- Changelog PUT ALL CHANGES BELOW!! -->


    <ul class="list-group">


      <!-- Minor Update -->

      <li class="list-group-item">
        <span class="badge bg-info">[DEV Update]</span><br>
        <strong>v0.2.1 - June 16, 2025:</strong> Updated Routes:
        <ul>
          <li>Added additional routing.</li>
          <li>Updated the routing to be more efficient.</li>
          <li>Started API</li>
        </ul>
      </li>

      <!-- Collapsible Older Changelog -->
      <div class="accordion mt-4" id="olderChangelog">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingOld">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOld" aria-expanded="false" aria-controls="collapseOld">
              📦 Older Changelog Entries
            </button>
          </h2>
          <div id="collapseOld" class="accordion-collapse collapse" aria-labelledby="headingOld" data-bs-parent="#olderChangelog">
            <div class="accordion-body p-0">

      <!-- Quickfix Update -->
      <li class="list-group-item">
        <span class="badge bg-danger">[Major Update]</span><br>
        <strong>v0.0.1 - Apr 20, 2025:</strong> Initial start.
      </li>


   
      </div>
    </div>
  </div>
</div>
    </ul>

     <!-- Future Additions -->
     <div class="accordion mb-4" id="futureFeatures">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingFuture">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFuture" aria-expanded="false" aria-controls="collapseFuture">
            🌱 Planned / Future Additions
          </button>
        </h2>
        <div id="collapseFuture" class="accordion-collapse collapse" aria-labelledby="headingFuture" data-bs-parent="#futureFeatures">
          <div class="accordion-body">
            <ul class="mb-0">
              <li>More Client Environments</li>
              <li>More Features</li>
              <li>More Bug Fixes</li>
              <li>More Documentation</li>
              <li>More Changelog Entries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  

</template>
