# Processing import-maps

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Usage



<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/import-maps-process/README.md';
      }
    }
  }
</script>
